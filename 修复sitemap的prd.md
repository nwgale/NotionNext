# Sitemap 统一方案规划 (PRD)

## 1. 需求总结/功能目标

本次任务的核心目标是**修复并统一Sitemap的生成机制**。最终，网站管理员在外部 `sitemap-paths.txt` 文件中维护的URL列表，能够在项目部署后，自动、可靠地出现在最终的 `sitemap.xml` 文件中。

## 2. 技术背景/环境依赖

*   **框架**: Next.js (v14.2.4)
*   **核心库**: `next-sitemap` (v1.6.203)
*   **部署与验证流程**:
    *   代码通过 **GitHub Desktop** 同步至 GitHub。
    *   GitHub 触发 **Vercel** (国际) 和 **阿里云** (国内) 的双部署流程。
    *   **所有验证均在线上进行**，不设本地开发环境。
    *   **验证渠道**:
        1.  **过程**: Vercel 构建日志 (Build Logs) 和构建产物 (Source)。
        2.  **结果**: 访问国内域名 `https://tianfei.chat/sitemap.xml`。
*   **冲突源**: 项目中存在 `pages/sitemap.xml.js` (动态方案) 和 `next-sitemap.config.js` (静态方案) 两个Sitemap生成机制，部署流程实际使用的是静态方案，导致混乱。

## 3. 核心原则

*   **单一来源原则**: 必须废弃动态方案 (`pages/sitemap.xml.js`)，确立静态方案 (`next-sitemap.config.js`) 为唯一权威来源。
*   **线上验证原则**: 所有阶段的检验标准都必须基于线上部署的结果。
*   **最小化依赖**: 优先利用 `next-sitemap` 库自身功能解决问题。

---

## 实施计划：以“可检验的交付成果”为中心

### 第 1 阶段：统一技术栈

**目标**: 移除冲突的动态Sitemap生成方案，确认静态方案 (`next-sitemap`) 能独立且正常地工作。

*   **开发动作**:
    1.  **[删除]** 删除 `pages/sitemap.xml.js` 文件。

*   **产品经理检验标准**:
    *   **验证方法**: 将代码通过GitHub Desktop同步并部署。
    *   **此时的预期行为**:
        1.  部署成功后，访问 `https://tianfei.chat/sitemap.xml`，页面应成功加载一个XML文件。
        2.  该XML文件的内容应只包含由 `next-sitemap` 自动扫描到的Notion文章等页面路径。这证明了静态方案已完全接管，且处于一个干净的“基准状态”。。
        3.vercel的网址是https://blogtianfei.vercel.app/，所以对应的sitemap是https://blogtianfei.vercel.app/sitemap.xml 能看到与tainfei.chat一样的内容

### 第 2 阶段：验证核心功能 (硬编码测试)

**目标**: 验证 `next-sitemap` 在当前项目中，具备通过 `additionalPaths` 添加硬编码路径的基础能力。

*   **开发动作**:
    1.  **[修改]** 修改 `next-sitemap.config.js` 文件，在 `module.exports` 对象中，添加 `additionalPaths` 函数，并确保函数返回一个包含2个硬编码测试路径的数组。
        ```javascript
        // next-sitemap.config.js
        additionalPaths: async (config) => {
          console.log('[PM-CHECK-2] Hardcoded paths test initiated.');
          const paths = [
            { loc: '/app/pm-check-2-a', lastmod: new Date().toISOString() },
            { loc: '/app/pm-check-2-b', lastmod: new Date().toISOString() }
          ];
          return paths;
        }
        ```

*   **产品经理检验标准**:
    *   **验证方法**: 将代码部署。
    *   **此时的预期行为**:
        1.  在Vercel的**构建日志**中，必须能搜索到关键字 `[PM-CHECK-2]`。
        2.  访问 `https://tianfei.chat/sitemap.xml`，其返回的XML文件内容中**必须包含** `/app/pm-check-2-a` 和 `/app/pm-check-2-b` 这两个新路径（以及第一阶段已有的Notion文章路径）。

### 第 3 阶段：验证本地文件读取能力

**目标**: 验证在构建环境中，`additionalPaths` 函数能够成功读取并处理项目内的本地文件。

*   **开发动作**:
    1.  **[新增]** 在项目根目录创建一个名为 `pm-check-3.txt` 的测试文件，文件内容仅一行: `/app/pm-check-3-from-file`。
    2.  **[修改]** 修改 `next-sitemap.config.js` 中的 `additionalPaths` 函数，使其读取 `pm-check-3.txt` 文件的内容，并将其作为路径返回。

*   **产品经理检验标准**:
    *   **验证方法**: 将代码部署。
    *   **此时的预期行为**: 访问 `https://tianfei.chat/sitemap.xml`，其返回的XML文件内容中**必须包含** `/app/pm-check-3-from-file` 这个路径。

### 第 4 阶段：验证完整自动化流程

**目标**: 验证从远程URL拉取路径文件，并整合到最终Sitemap的完整自动化流程。

*   **开发动作**:
    1.  **[新增]** 创建一个 `scripts/fetch-sitemap-paths.js` 脚本，负责从 `https://tianfei.chat/app/sitemap-paths.txt` 下载内容，并写入到项目根目录下的 `.sitemap-paths-temp.txt` 文件中。
    2.  **[修改]** 修改 `package.json` 中的 `export` 脚本，在 `next build` 之前执行该脚本: `"export": "node scripts/fetch-sitemap-paths.js && cross-env EXPORT=true next build && next-sitemap --config next-sitemap.config.js"`。
    3.  **[修改]** 修改 `next-sitemap.config.js` 中的 `additionalPaths` 函数，使其从 `.sitemap-paths-temp.txt` 读取路径。

*   **产品经理检验标准**:
    *   **验证方法**: 将代码部署。
    *   **此时的预期行为**:
        1.  在Vercel的构建日志中，能看到 `fetch-sitemap-paths.js` 脚本被执行的日志。
        2.  访问 `https://tianfei.chat/sitemap.xml`，其返回的XML文件内容中**必须包含** `https://tianfei.chat/app/sitemap-paths.txt` 中当前定义的所有路径。

## 4. 风险评估与应对预案

| 风险点 | 应对预案 (Plan C) |
| :--- | :--- |
| **Phase 1 失败**: `additionalPaths` 即使硬编码也无效。 | **放弃 `next-sitemap`**。开发一个独立的 `scripts/generate-full-sitemap.js` 脚本，该脚本负责扫描构建产物、拉取外部路径、并从零生成完整的 `sitemap.xml`。将 `post-build` 命令完全指向此脚本。 |
| **Phase 2 失败**: 构建环境无法读取本地文件。 | **直接启动 Plan C**。这表明 `next-sitemap` 的运行沙箱与文件系统存在隔离，自定义脚本是更可靠的选择。 |
| **Phase 3 失败**: `fetch` 脚本与 `build` 存在时序或缓存问题。 | **优化时序**: 尝试将 `fetch` 脚本与 `post-build` 命令结合，确保在 `next-sitemap` 运行前一刻才生成文件。如果仍然失败，则**启动 Plan C**。 |