# Sitemap 统一方案规划 (PRD)

## 1. 需求总结/功能目标

本次任务的核心目标是**修复并统一Sitemap的生成机制**。最终，网站管理员在外部 `sitemap-paths.txt` 文件中维护的URL列表，能够在项目部署后，自动、可靠地出现在最终的 `sitemap.xml` 文件中。

## 2. 技术背景/环境依赖

*   **框架**: Next.js (v14.2.4)
*   **核心库**: `next-sitemap` (v3.1.55) - *已升级*
*   **部署与验证流程**:
    *   代码通过 **GitHub Desktop** 同步至 GitHub。
    *   GitHub 触发 **Vercel** (国际) 和 **阿里云** (国内) 的双部署流程。
    *   **所有验证均在线上进行**，不设本地开发环境。
    *   **验证渠道**:
        1.  **过程**: Vercel 构建日志 (Build Logs) 和构建产物 (Source)。
        2.  **结果**: 访问国内域名 `https://tianfei.chat/sitemap.xml`。
*   **核心问题**: 经过多轮测试，已确认 `next-sitemap` 库的 `additionalPaths` 功能在当前 `next export` 环境下存在缺陷，无法按预期工作。

## 3. 核心原则

*   **规避缺陷**: 承认并规避 `next-sitemap` 的缺陷，不再尝试修复其 `additionalPaths` 功能。
*   **分工协作**: 将 Sitemap 生成过程拆分为多个独立、可靠的步骤，组合使用工具，而不是依赖单一工具。
*   **完全可控**: 最终方案必须是逻辑清晰、过程透明、完全由我们自己控制的。

---

## 4. 实施计划 (双轨制)

鉴于 `next-sitemap` 库在当前项目环境中表现出的不确定性，我们制定以下双轨计划。我们将首先执行计划甲，仅在计划甲被证明不可行时，才启动计划乙。

---

### (计划甲) 实施计划 (首选方案: 分工协作)

**核心思想**: 采用“管道（Pipeline）”模式。我们精准地利用 `next-sitemap` 最稳定、最核心的“扫描内部路径”功能，然后用我们自己的脚本来完成“合并外部路径”和“生成最终文件”这两步，实现“扬长避短”。

#### **第 1 阶段：改造工人B，生成中间产物 **

**目标**: 配置 `next-sitemap`，使其恢复默认行为，仅作为“内部路径扫描器”，并将结果输出到一个临时的中间文件。

*   **开发动作**:
    1.  **[修改]** 修改 `next-sitemap.config.js`，移除 `additionalPaths`，并增加 `sitemapBaseFileName` 选项，将输出文件名指定为 `sitemap-next`。
        ```javascript
        // next-sitemap.config.js (示例)
        module.exports = {
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tianfei.chat',
          changefreq: 'daily',
          priority: 0.7,
          generateRobotsTxt: true,
          sitemapBaseFileName: 'sitemap-next', // 指定中间文件基础名
          // ... 其他基础配置, 确保没有 additionalPaths
        }
        ```
    2.  **[修改]** 修改 `package.json` 中的 `export` 脚本，确保 `next-sitemap` 在 `next build` 之后运行。
        `"export": "cross-env EXPORT=true next build && next-sitemap"`

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，检查 Vercel 的**构建产物 (Source -> Output)**。
    *   **此时的预期行为**:
        1.  在 `out/` 目录下，必须能找到一个名为 `sitemap-next.xml` 的文件。
        2.  `sitemap-next.xml` 的内容应只包含由 `next-sitemap` 自动扫描到的Notion文章等内部页面路径。
        3.  此时 `out/sitemap.xml` 文件理论上不应存在，我们不关心它。

#### **第 2 阶段：创建工人C，完成合并与生成**

**目标**: 创建一个我们自己的、完全可控的脚本，负责读取 `next-sitemap` 生成的内部路径 sitemap 和外部路径列表，并生成最终的 `sitemap.xml`。

*   **开发动作**:
    1.  **[依赖确认]** 确保 `axios`, `sitemap`, `xml2js` 已被安装。
    2.  **[新增]** 创建 `scripts/merge-sitemap.js` 文件。该脚本将执行以下逻辑：
        *   **[读取内部路径]** 读取并用 `xml2js` 解析 `out/sitemap-next.xml`，提取出所有内部 URL。
        *   **[获取外部路径]** 使用 `axios` 从 `https://tianfei.chat/app/sitemap-paths.txt` 下载路径文件内容。
        *   **[处理外部路径]** 解析文本内容，将每一行相对路径 (如 `/app/app2/`) 转换为完整的绝对路径 (如 `https://tianfei.chat/app/app2/`)。
        *   **[合并]** 合并内部和外部的 URL 列表。
        *   **[生成]** 调用 `sitemap` 库，根据合并后的列表生成最终的 XML 字符串。
        *   **[写入]** 将该字符串**覆盖写入**到 `out/sitemap.xml` 文件中。
    3.  **[修改]** 修改 `package.json` 中的 `export` 脚本，形成三步接力：
        `"export": "cross-env EXPORT=true next build && next-sitemap && node scripts/merge-sitemap.js"`

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，访问 `https://tianfei.chat/sitemap.xml`。
    *   **此时的预期行为**:
        1.  最终的 `sitemap.xml` 文件必须同时包含来自 `sitemap-next.xml` 的内部路径和来自 `sitemap-paths.txt` 的外部路径。
        2.  整个流程无差错，部署成功。

---

### (计划乙) 实施计划 (备用方案: 完全自控)

**核心思想**: 仅在计划甲失败时启动。彻底放弃 `next-sitemap`，用一个通用库和我们自己的脚本来100%掌控整个流程。

#### **第 1 阶段：替换依赖，自研扫描器**

**目标**: 移除 `next-sitemap`，用我们自己的脚本实现扫描 `out/` 目录并生成仅包含内部路径的 Sitemap。

*   **开发动作**:
    1.  **[移除]** 从 `package.json` 中移除 `next-sitemap`。
    2.  **[安装]** 确保 `sitemap` 和 `glob` 已安装。
    3.  **[新增]** 创建 `scripts/generate-full-sitemap.js` 文件。脚本逻辑：
        *   使用 `glob` 扫描 `out/**/*.html`。
        *   编写路径转换逻辑（例如，`out/article/post.html` -> `https://tianfei.chat/article/post`）。
        *   调用 `sitemap` 库生成 XML，并写入 `out/sitemap.xml`。
    4.  **[修改]** 修改 `package.json` `export` 脚本为: `"export": "cross-env EXPORT=true next build && node scripts/generate-full-sitemap.js"`。

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，访问 `https://tianfei.chat/sitemap.xml`。
    *   **此时的预期行为**: `sitemap.xml` 必须被成功生成，且内容与计划甲第1阶段生成的 `sitemap.xml` 基本一致。

#### **第 2 阶段：整合外部路径**

**目标**: 在我们自己的脚本中，加入读取和合并外部路径的功能。

*   **开发动作**:
    1.  **[修改]** 修改 `scripts/generate-full-sitemap.js`，增加以下逻辑：
        *   从 `https://tianfei.chat/app/sitemap-paths.txt` 下载外部路径。
        *   将相对路径转换为绝对路径。
        *   将这些外部路径与脚本已扫描到的内部路径合并。

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，访问 `https://tianfei.chat/sitemap.xml`。
    *   **此时的预期行为**: 最终的 `sitemap.xml` 文件必须同时包含扫描到的内部路径和文件中的外部路径。