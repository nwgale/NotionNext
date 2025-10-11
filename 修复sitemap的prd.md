# Sitemap 统一方案规划 (PRD) - V3

## 1. 需求总结/功能目标

本次任务的核心目标是**修复并统一Sitemap的生成机制**，并**全面优化SEO效果**。最终，无论是内部文章还是外部URL，其精确的最后修改时间（`lastmod`）都能自动、可靠地出现在最终的 `sitemap.xml` 文件中。

## 2. 技术背景/环境依赖

*   **框架**: Next.js (v14.2.4)
*   **核心库**: `next-sitemap` (v3.1.55)
*   **部署与验证流程**:
    *   代码通过 **GitHub Desktop** 同步至 GitHub。
    *   GitHub 触发 **Vercel** (国际) 和 **阿里云** (国内) 的双部署流程。
    *   **所有验证均在线上进行**，不设本地开发环境。
    *   **验证渠道**:
        1.  **过程**: Vercel 构建日志 (Build Logs)。
        2.  **结果**: 访问国内域名 `https://tianfei.chat/sitemap.xml`。
*   **核心问题**: 经过多轮测试，已确认 `next-sitemap` 库存在两个核心问题：
    1.  **功能缺陷**: 其 `additionalPaths` 功能不可靠。
    2.  **数据截断**: 在我们的构建环境中，它会将其 `transform` 函数提供的完整 ISO 格式时间戳 (`...T15:32:02.900Z`) **截断为仅日期格式** (`...`)，导致 `lastmod` 信息严重失真。
*   **既定事实**: `next-sitemap` 生成的中间文件名始终为 `sitemap.xml`，此行为已被接纳为流程的一部分。
*   **外部路径源文件 (`sitemap-paths.txt`) 格式**: 文件格式已变更为 `[路径]|[ISO 8601格式日期]`，例如 `/app/app2/|2025-09-30T21:22:25+08:00`，以便为每个外部URL提供精确的 `lastmod` 时间。

## 3. 核心原则

*   **规避缺陷**: 承认并规避 `next-sitemap` 的已知缺陷。
*   **分工协作**: 将 Sitemap 生成过程拆分为多个独立、可靠的步骤，组合使用工具。
*   **完全可控**: 最终方案逻辑清晰、过程透明、完全由我们自己控制。

---

## 4. 最终实施方案

**核心思想**: 采用“**信任链（Chain of Trust）**”模式。我们将 `next-sitemap` 的角色降级，仅将其用作一个不可靠但必要的**“路径扫描器”**。我们自己的脚本 (`scripts/merge-sitemap.js`) 则作为**“最终校准与合并中心”**，拥有对 `lastmod` 数据的最终决定权。

工人A (档案员) 加载可信的时间戳。
工人B (检验员) 提取 next-sitemap 的草稿中的路径，并丢弃错误数据。
工人C (校准员) 使用档案员的数据修正时间戳。
工人D (总装员) 合并内外路径，生成最终成品。

**流程概述**:
1.  `next build` 生成我们自己的、100%可信的时间戳缓存 (`lastmod-map.json`)。
2.  `next-sitemap` 扫描项目，生成一个包含所有内部路径、但 `lastmod` **时间戳错误**的中间 `sitemap.xml`。
3.  `scripts/merge-sitemap.js` 接管，**忽略**中间文件的错误时间戳，从我们自己的缓存中读取正确时间，并与外部路径合并，生成最终的、完全正确的 `sitemap.xml`。

**执行流程 (在 `.github/workflows/deploy-to-domestic.yml` 中定义):**
```bash
npx next build
npx next-sitemap
node scripts/merge-sitemap.js
```

---

### **第 1 步：生成可信的时间戳缓存 (在 `next build` 内部实现)**

*   **核心思想**: 采用“**构建时合并缓存**”策略。由于 `next build` 会多次调用数据获取函数，我们必须确保每次调用都**追加**而不是**覆盖**缓存。
*   **目标**: 在 `lib/db/getSiteData.js` 中，生成一个**完整且可信的** `lastmod-map.json` 文件，作为 `lastmod` 数据的唯一真实来源。
*   **动作**:
    1.  在 `getSiteData.js` 的 `handleDataBeforeReturn` 函数内，每次执行时：
    2.  首先**读取**已存在的 `.next/cache/lastmod-map.json` 文件（如果存在）。
    3.  然后为当前批次的页面创建新的时间戳映射。
    4.  将新的映射**合并**到已读取的旧映射中。
    5.  将合并后的完整映射**写回**到 `.next/cache/lastmod-map.json`。
*   **产物**: 在构建过程中，`.next/cache/` 目录下生成一个 `lastmod-map.json` 文件，包含所有页面的精确 `lastmod` 时间戳。

---

### **第 2 步：利用 `next-sitemap` 扫描内部路径**

*   **核心思想**: **角色降级**。将 `next-sitemap` 严格限定为一个**“路径扫描器”**，不再信任其任何数据处理能力。
*   **目标**: 生成一个仅用于提供**内部 URL 列表**的中间 `sitemap.xml` 文件。
*   **动作**:
    1.  执行 `npx next-sitemap` 命令。
    2.  `next-sitemap` 会自动扫描项目结构，并生成一个 `sitemap.xml`。
*   **产物**: 在 `out/` 目录下生成一个 `sitemap.xml` 文件。**我们明确知道此文件中的 `<lastmod>` 标签是错误的、被截断的，并将在下一步中完全忽略它。**

---

### **第 3 步：校准内部路径时间戳 (由 `scripts/merge-sitemap.js` 完成)**

*   **核心思想**: **数据校准**。此步骤是修正 `next-sitemap` 数据错误的第一道关卡，确保内部路径的时间戳准确无误。
*   **目标**: 生成一个仅包含内部路径、但 `lastmod` 时间戳**完全正确**的中间版 Sitemap。
*   **动作**:
    1.  **[加载可信数据源]** 脚本启动，首先读取并解析我们自己的缓存文件 `.next/cache/lastmod-map.json`，将其加载到内存 `lastmodMap` 中。
    2.  **[提取路径，忽略时间]** 读取 `next-sitemap` 生成的中间 `out/sitemap.xml` 文件。解析时，**只提取每个 URL 的路径 (`<loc>`)**，并**完全忽略**其中错误的 `<lastmod>` 标签。
    3.  **[校准时间]** 遍历提取出的内部路径列表。对于每个路径，从内存中的 `lastmodMap` 查找并应用其对应的、正确的、完整的 `lastmod` 时间戳。
    4.  **[生成并覆盖]** 使用 `xmlbuilder2` 等库，根据**校准后**的内部 URL 列表，生成新的 XML 内容，并**覆盖写回**到 `out/sitemap.xml` 文件。
*   **产物**: `out/sitemap.xml` 文件被更新。此时，它包含了所有内部路径，并且每个路径的 `lastmod` 时间戳都是精确的。它将作为下一步的输入。

### **第 4 步：合并外部路径并生成最终 Sitemap (由 `scripts/merge-sitemap.js` 完成)**

*   **核心思想**: **增量合并**。此步骤负责将外部世界的路径集成进来，完成最终的 Sitemap。
*   **目标**: 将外部路径合并到已校准的内部 Sitemap 中，生成最终的 `sitemap.xml`。
*   **动作**:
    1.  **[读取已校准的Sitemap]** 脚本继续执行，读取上一步生成的、时间已校准的 `out/sitemap.xml` 文件，并解析出所有内部 URL 列表。
    2.  **[获取外部路径]** 从 `sitemap-paths.txt` 源获取外部路径列表及其 `lastmod` 时间。
    3.  **[合并]** 将内部 URL 列表和外部 URL 列表合并成一个完整的 URL 集合。
    4.  **[生成并覆盖]** 使用 `xmlbuilder2` 等库，根据合并后的完整列表，生成最终的 XML 内容，并**再次覆盖写回**到 `out/sitemap.xml` 文件。
*   **最终产物**: `out/sitemap.xml` 文件现在是一个包含所有内部和外部路径、且所有 `lastmod` 时间戳都完全正确的最终版本。

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，访问 `https://tianfei.chat/sitemap.xml`。
    *   **预期行为**:
        1.  最终的 `sitemap.xml` 文件必须同时包含项目内部路径和 `sitemap-paths.txt` 中定义的所有外部路径。
        2.  **无论是内部路径还是外部路径，其 `<lastmod>` 标签都必须包含精确到时分秒的时间信息。**
        3.  整个流程无差错，部署成功。