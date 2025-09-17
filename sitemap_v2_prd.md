# Sitemap 功能升级最终开发计划 (PRD V2)

## 1. 核心目标

**专注一件事**：实现一种自动化、高稳定、零侵入的机制，将存放在 Notion 配置中心的自定义页面路径列表（`APP_LIST_FOR_SITEMAP`），在执行静态网站导出时，动态注入到最终生成的 `sitemap.xml` 文件中。

## 2. 最终策略：数据解耦

我们将彻底放弃之前“改造核心库”的旧方案，采用全新的“数据解耦”策略，以确保最高稳定性和未来可维护性。

1.  **创建独立的数据抓取脚本**: 新建一个独立的 Node.js 脚本，其唯一职责是在构建开始前，从 Notion 获取自定义路径列表，并将其写入一个本地临时 JSON 文件 (`.sitemap-paths.json`)。
2.  **改造构建流程**: 修改 `package.json` 中的构建命令，确保在执行 `next-sitemap` 之前，先运行这个数据抓取脚本。
3.  **简化 Sitemap 配置**: `next-sitemap.config.js` 的任务将变得极其简单，只需同步读取本地的临时 JSON 文件即可，不再需要任何复杂的异步操作或数据依赖。

### 2.1 策略优势

*   ✅ **零核心文件修改**: 完全不触碰 `lib/` 目录下的任何文件，彻底杜绝我们之前遇到的连锁错误，不影响未来项目升级。
*   ✅ **职责单一**: 数据获取和 Sitemap 生成被清晰地解耦，每个环节都极其简单。
*   ✅ **高度稳定**: 斩断了复杂的依赖链，构建过程将变得可预测且稳定。

## 3. 详细实施步骤

这是一个可以按部就班执行的精确指南。

### 步骤 3.1: 安装路径别名辅助工具

为了让我们的独立脚本能方便地引用项目配置（如 `blog.config.js`），我们将安装一个轻量级的开发依赖 `module-alias`。

**执行命令**:
```bash
npm install module-alias --save-dev
```

### 步骤 3.2: 配置 `package.json`

我们需要对 `package.json` 进行两处修改：
1.  告知 `module-alias` 我们的路径别名规则。
2.  将我们的新脚本加入到构建流程中。

**修改内容**:
1.  在 `package.json` 的根级别（与 `name`, `version` 同级）添加以下内容：
    ```json
    "_moduleAliases": {
      "@": "."
    }
    ```
2.  找到 `scripts` 对象中的 `export` 命令，在 `cross-env` 命令之前，加入运行我们新脚本的命令。
    *   **修改前**: `"export": "cross-env EXPORT=true next build && next-sitemap"`
    *   **修改后**: `"export": "node scripts/generate-sitemap-paths.js && cross-env EXPORT=true next build && next-sitemap"`

### 步骤 3.3: 创建数据抓取脚本

我们将创建这个方案的核心——独立的数据抓取脚本。

1.  **创建目录**:
    ```bash
    mkdir -p scripts
    ```
2.  **创建文件** `scripts/generate-sitemap-paths.js`，并写入以下**完整内容**：
    ```javascript
    // scripts/generate-sitemap-paths.js
    // 职责：在构建前运行，从Notion获取自定义路径，并写入一个临时的JSON文件。

    // 注册模块别名，允许此脚本使用 '@/' 路径
    try {
      require('module-alias/register');
    } catch (e) {
      // 在某些环境下，如果直接从根目录运行，可能已注册
    }

    const fs = require('fs');
    const path = require('path');
    const { getGlobalData } = require('@/lib/db/getSiteData');
    const { siteConfig } = require('@/lib/config');
    const BLOG = require('@/blog.config');

    const outputFile = path.join(__dirname, '..', '.sitemap-paths.json');

    async function generatePaths() {
      console.log('[Sitemap Generator]: Starting to fetch custom paths from Notion...');

      try {
        const siteData = await getGlobalData({ pageId: BLOG.NOTION_PAGE_ID });
        const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG);

        if (!appListString) {
          console.log('[Sitemap Generator]: APP_LIST_FOR_SITEMAP is empty in Notion. Writing empty array.');
          fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
          return;
        }

        const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '');
        console.log(`[Sitemap Generator]: Found ${appPaths.length} custom paths.`);

        fs.writeFileSync(outputFile, JSON.stringify(appPaths, null, 2));
        console.log(`[Sitemap Generator]: Successfully wrote paths to ${outputFile}`);

      } catch (error) {
        console.error('[Sitemap Generator]: An error occurred:', error);
        // 如果发生错误，写入一个空数组以防主构建流程中断
        fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
        console.log('[Sitemap Generator]: Wrote empty array to fallback file due to error.');
      }
    }

    generatePaths();
    ```

### 步骤 3.4: 简化 `next-sitemap.config.js`

最后，我们改造 `next-sitemap.config.js`，让它只做一件事：读取本地的临时JSON文件。

**修改后的完整文件内容**:
```javascript
const BLOG = require('./blog.config')
const fs = require('fs')
const path = require('path')

/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // additionalPaths 函数现在极其简单和稳定
  additionalPaths: async (config) => {
    const tempFilePath = path.join(__dirname, '.sitemap-paths.json');
    let additionalPaths = [];

    try {
      // 检查临时文件是否存在
      if (fs.existsSync(tempFilePath)) {
        const fileContent = fs.readFileSync(tempFilePath, 'utf8');
        const paths = JSON.parse(fileContent);
        const dateNow = new Date().toISOString();

        // 将路径数组格式化为 sitemap 条目
        additionalPaths = paths.map(p => ({
          loc: `${BLOG.LINK}${p.trim()}`,
          lastmod: dateNow,
          changefreq: 'daily',
          priority: '0.7'
        }));
      }
    } catch (error) {
      console.error('Error reading or parsing .sitemap-paths.json', error);
    }

    return additionalPaths;
  }
}
```

## 4. 验证方案

1.  在 Notion 中确认 `APP_LIST_FOR_SITEMAP` 字段存在且有值。
2.  触发 GitHub Actions 工作流。
3.  **检查点 1**: 观察构建日志，确认 `[Sitemap Generator]` 的日志被打印出来，且没有错误。
4.  **检查点 2**: 确认整个构建流程成功完成。
5.  **最终验证**: 访问 `https://tianfei.chat/sitemap.xml`，确认其中包含了 Notion 中配置的自定义路径。

## 5. 回滚方案

此方案侵入性极低，回滚非常简单：
1.  Revert 对 `package.json` 和 `next-sitemap.config.js` 的修改。
2.  删除 `scripts/` 目录和 `node_modules/module-alias`。
3.  项目将恢复至本次开发前的状态。