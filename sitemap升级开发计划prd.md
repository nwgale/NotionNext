# Sitemap 功能升级开发计划 (PRD)

## 1. 目标

实现一种自动化、易于维护的机制，将存放在 Notion 配置中心的自定义页面路径列表（`APP_LIST_FOR_SITEMAP`），在执行静态网站导出时，动态注入到最终生成的 `sitemap.xml` 文件中，以提升这些独立静态页面的 SEO 可发现性。

## 2. 背景与痛点

- **背景**: 网站通过 Nginx `alias` 指令，拥有一个完全独立于 NotionNext 构建体系的静态内容目录 `/app/`。
- **痛点**: `/app/` 目录下的页面（如产品落地页）无法被 NotionNext 的构建过程感知，因此不会出现在自动生成的 `sitemap.xml` 中，导致搜索引擎收录困难。

## 3. 关键技术分析

经过我们之前深入的排查，我们已经对项目的构建和 Sitemap 生成机制有了决定性的理解。

### 3.1 Sitemap 生成机制定位

- **结论**: 在您当前的静态导出（`next export`）构建流程中，`sitemap.xml` 文件**不是**由我们之前关注的 `pages/sitemap.xml.js` 文件生成的。
- **真正执行者**: Sitemap 是由一个名为 `next-sitemap` 的第三方库，在 `next build` 之后独立运行的。它读取的配置文件是项目根目录下的 `next-sitemap.config.js`。
- **实施关键**: 我们所有的修改逻辑，都必须围绕 `next-sitemap.config.js` 文件展开。

### 3.2 Notion 数据读取方案

- **方案**: `next-sitemap.config.js` 支持一个名为 `additionalPaths` 的异步函数。我们可以在这个函数中编写代码，在构建时连接到 Notion 数据库，读取配置信息。
- **实现**: 我们将复用项目已有的核心数据获取函数 `getGlobalData`（位于 `lib/db/getSiteData.js`），以确保数据读取逻辑与项目其他部分保持一致。

### 3.3 核心文件修改的必要性 (重要)

- **挑战**: `next-sitemap` 脚本运行在一个纯净的 Node.js 环境中，这个环境不像 Next.js 的完整环境那样“智能”。它无法识别路径别名（如 `@/`）或自动处理不同模块系统（ESM vs CommonJS）的混用。
- **结论**: 为了让核心数据函数 `getGlobalData` 能够在这个纯净环境中被成功调用，我们**必须**对其依赖链上的一些核心 `lib` 文件进行微小的、向下兼容的“适配”修改。
- **您的顾虑**: 您担心修改核心文件会影响未来升级。这一点我们非常重视。因此，所有修改都将遵循以下原则：
    1.  **不改变业务逻辑**: 只做语法和路径的兼容性调整。
    2.  **改动极小化**: 只修改必要的几行代码。
    3.  **标准化**: 使代码更符合通用的 Node.js 标准，这通常会降低而非增加未来升级的冲突风险。
- **涉及文件**: `lib/db/getSiteData.js`, `lib/config.js`, `lib/utils/index.js`, `lib/utils/pageId.js` 等。

## 4. 开发实施步骤

### 第 1 步：核心库兼容性修复

这是为了让 `next-sitemap` 脚本能调用项目核心功能所做的必要铺垫。

1.  **净化 `lib/utils/index.js`**: 移除其中与 React/JSX 相关的代码（`memorize` 函数），使其成为一个纯粹的、前后端通用的工具库。
2.  **统一模块系统**: 检查 `lib/` 目录下的相关文件（如 `pageId.js`），确保它们都使用标准的 ESM `export` 语法，而不是旧的 `module.exports`。
3.  **修复路径引用**: 检查 `lib/` 目录下的相关文件（如 `getSiteData.js`, `config.js`），将所有 `@/` 别名路径改为标准的相对路径（如 `../`），并为所有本地模块导入添加 `.js` 文件后缀，以符合 ESM 规范。

### 第 2 步：升级 Sitemap 配置

这是实现我们核心需求的步骤。

1.  **修改 `next-sitemap.config.js`**:
2.  在该文件中，实现 `additionalPaths` 异步函数。
3.  在函数内部，`import` 我们在第 1 步中修复好的 `getGlobalData` 等核心函数。
4.  调用 `getGlobalData` 来获取完整的 Notion 配置。
5.  从配置中提取 `APP_LIST_FOR_SITEMAP` 字段的值。
6.  解析这个以换行符分隔的字符串，将其转换为一个路径数组。
7.  将路径数组格式化为 `next-sitemap` 要求的对象结构（包含 `loc`, `lastmod` 等字段）。
8.  返回这个格式化后的数组。

## 5. 验证方案

1.  在 Notion 配置中心的 `APP_LIST_FOR_SITEMAP` 字段中，添加至少两个测试路径（例如 `/app/yuliu/` 和 `/app/beadflow/`）。
2.  在本地或通过 GitHub Actions 触发一次完整的生产构建 (`npm run export`)。
3.  **检查点 1**: 确认构建过程无任何错误并成功完成。
4.  **检查点 2**: 查看最终生成的 `out/sitemap.xml` 文件。
5.  **验证**: 确认文件中包含了我们在 Notion 中添加的所有自定义路径，并且格式正确。

## 6. 风险与回滚方案

- **风险**: 在修复核心库的兼容性时，可能遗漏了某个深层依赖，导致构建失败。
- **应对**: 构建日志将明确指出失败的文件和原因，我们可以快速定位并进行补充修复。
- **回滚方案**: 所有修改都在 Git 版本控制之下。如果出现不可预见的问题，我们可以通过 `git reset --hard` 命令，将代码库完全恢复到本次开发之前的状态。