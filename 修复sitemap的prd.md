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
*   **核心问题**: 经过多轮测试，已确认 `next-sitemap` 库的 `additionalPaths` 功能存在缺陷。**此外，其 `sitemapBaseFileName` 配置选项在我们的构建环境中仅在日志中生效，实际生成的文件名始终为 `sitemap.xml`，此行为已被验证并接纳为流程的一部分。**
*   **外部路径源文件 (`sitemap-paths.txt`) 格式**: 文件格式已变更为 `[路径]|[ISO 8601格式日期]`，例如 `/app/app2/|2025-09-30T21:22:25+08:00`，以便为每个外部URL提供精确的 `lastmod` 时间。

## 3. 核心原则

*   **规避缺陷**: 承认并规避 `next-sitemap` 的已知缺陷。
*   **分工协作**: 将 Sitemap 生成过程拆分为多个独立、可靠的步骤，组合使用工具。
*   **完全可控**: 最终方案逻辑清晰、过程透明、完全由我们自己控制。

---

## 4. 最终实施方案

**核心思想**: 采用“管道（Pipeline）”模式。我们利用 `next-sitemap` 作为“内部路径扫描器”，生成一个包含内部页面的初始版 `sitemap.xml`。然后，我们自己的脚本接管这个文件，将其作为“中间产物”，在其中混入包含精确时间的外部路径，最后**覆盖写回**同名文件，完成整个流程。

**执行流程 (在 `.github/workflows/deploy-to-domestic.yml` 中定义):**
```bash
npx next build
npx next-sitemap
node scripts/merge-sitemap.js
```

---

### **第 1 步：生成精确的时间地图 (在 `next build` 内部实现)**

*   **核心思想**: 采用“**构建时缓存**”策略。在 `next build` 阶段，当所有文章数据从Notion API被一次性拉取后，立即将“路径到精确修改时间”的映射关系写入一个临时的JSON缓存文件。
*   **目标**: 在 `lib/notion/getAllPosts.js` (或类似核心数据文件) 中，生成一个包含所有内部文章精确修改时间的缓存文件。
*   **动作**:
    1.  在 `getAllPosts.js` 文件末尾，当所有文章数据（`allPosts`）都已处理完毕后，遍历该列表。
    2.  创建一个简单的 `路径: 精确时间` 映射对象。
    3.  使用 `fs` 模块，将此对象序列化并同步写入到临时文件 `.next/lastmod-map.json` 中。
*   **产物**: 在构建过程中，`.next/` 目录下会生成一个 `lastmod-map.json` 文件。

---

### **第 2 步：生成包含精确时间的初始 Sitemap (由 `next-sitemap` 完成)**

*   **核心思想**: 采用“**转换时读取**”策略。利用 `next-sitemap` 强大的 `transform` 功能，高效地从上一步生成的缓存文件中读取时间数据。
*   **目标**: 利用 `next-sitemap` 和时间地图，生成一个包含**精确 `lastmod` 时间**的、只含内部路径的 `sitemap.xml` 文件。
*   **动作**:
    1.  修改 `next-sitemap.config.js` 文件。
    2.  在文件顶部，读取并解析 `.next/lastmod-map.json` 文件，将其内容加载到内存变量 `lastmodMap` 中。
    3.  实现 `transform` 函数：对于每个页面路径 `path`，从 `lastmodMap` 中查找对应的时间，并将其作为 `lastmod` 值返回。
    4.  执行 `npx next-sitemap` 命令。
*   **产物**: 在 `out/` 目录下生成一个 `sitemap.xml` 文件。此时，该文件已包含精确的内部页面时间，并作为下一步的**中间产物**。

---

### **第 3 步：合并外部路径并生成最终 Sitemap (由 `scripts/merge-sitemap.js` 完成)**

*   **目标**: 读取上一步生成的 `sitemap.xml`，解析并合并 `sitemap-paths.txt` 中的外部路径及其精确时间，最终生成完整的 `sitemap.xml`。
*   **动作**:
    1.  **[读取]** 脚本启动，首先读取 `out/sitemap.xml` 文件，解析出所有内部URL及其元数据。
    2.  **[获取]** 脚本从 `sitemap-paths.txt` 源获取外部路径列表。
    3.  **[解析]** 脚本按行解析外部路径文件。对于每一行（如 `/app/app2/|2025-09-30T21:22:25+08:00`）：
        *   使用 `|` 分隔符拆分路径和日期。
        *   路径部分作为 URL 的 `loc`。
        *   日期部分作为 URL 的 `lastmod`。
    4.  **[合并]** 将处理后的内部URL列表和外部URL列表合并。
    5.  **[生成并覆盖]** 使用 `sitemap` 库，根据合并后的完整列表，生成最终的XML内容，并**覆盖写回**到 `out/sitemap.xml` 文件。

*   **产品经理检验标准**:
    *   **验证方法**: 部署后，访问 `https://tianfei.chat/sitemap.xml`。
    *   **预期行为**:
        1.  最终的 `sitemap.xml` 文件必须同时包含项目内部路径和 `sitemap-paths.txt` 中定义的所有外部路径。
        2.  **无论是内部路径还是外部路径，其 `<lastmod>` 标签都必须包含精确到时分秒的时间信息。**
        3.  整个流程无差错，部署成功。