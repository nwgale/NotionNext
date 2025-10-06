# Sitemap 功能侦察与反攻计划 (PRD V4)

## 目标与要求 (Goal & Requirements)

### 最终目标 (The Goal)
实现一个自动化流程，将一个外部维护的 URL 列表（例如服务器上的一个 `sitemap-paths.txt` 文件）成功地添加进项目最终生成的 `sitemap.xml` 文件中。

### 当前困境 (The Problem)
在本项目中，用于生成 Sitemap 的标准库 `next-sitemap` 表现出“静默失败”的异常行为。即：尽管我们通过日志确认已将正确的额外路径数据“喂”给了它，但它最终生成的 `sitemap.xml` 文件中并未包含这些路径。此问题在本地、GitHub Actions、Vercel 等多个环境中都无法稳定复现或解决。

### 本计划的核心策略 (The Strategy)
为彻底解决此“幽灵问题”，本计划放弃“一步到位”的开发思路，采用严谨的“从简到繁”的倒推验证法。我们将从最不可能失败的“硬编码”开始，像做科学实验一样，逐一增加变量（文件读取、动态生成等），以精准定位导致失败的根本环节。

**本文档的读者，无论之前对项目了解多少，都应严格遵循以下阶段性步骤，不可跳跃，以便系统性地完成侦察任务。**

---
## 贯穿始终的侦察要点 (Key Investigation Points)

*   **日志优先 (Log First)**: 在每个关键步骤，我们都将添加明确的日志。检查 Vercel 或 GitHub Actions 的构建日志是判断该步骤是否被执行、执行结果如何的**首要方式**。
*   **警惕缓存 (Beware of Cache)**: Vercel 和 CI/CD 环境都有构建缓存。在分析问题时，需留意构建日志中关于缓存命中（cache hit）或未命中（cache miss）的线索，特别是与 `.sitemap-paths.json` 文件相关的部分。

---

## 反攻计划 (从最核心开始)

### ✅ 第 1 阶段：终极对质 (硬编码测试)

**目标：** 验证 `next-sitemap` 在您项目中，是否具备最基本的、添加硬编码路径的能力。这是对该库核心功能的直接质询。

*   **行动：**
    1.  **我将修改 `next-sitemap.config.js` 文件**，移除所有外部依赖和文件读取逻辑。
    2.  `additionalPaths` 函数将直接返回一个写死的、包含3个全新测试路径的数组，并**加入明确的日志**。
        ```javascript
        // next-sitemap.config.js (硬编码测试版)
        additionalPaths: async (config) => {
          console.log('Sitemap Phase 1 Test: Returning hardcoded paths...');
          const dateNow = new Date().toISOString();
          const paths = [
            { loc: 'https://tianfei.chat/app/test1/', lastmod: dateNow },
            { loc: 'https://tianfei.chat/app/test2/', lastmod: dateNow },
            { loc: 'https://tianfei.chat/app/test3/', lastmod: dateNow }
          ];
          console.log('Sitemap Phase 1 Test: Hardcoded paths are:', paths);
          return paths;
        }
        ```

*   **检验标准：**
    *   **验证方法：** 部署后，首先检查 Vercel 构建日志，确认 `Sitemap Phase 1 Test` 日志已打印。然后分别检查 Vercel 和阿里云服务器上的 `sitemap.xml` 文件。
    *   **预期行为：**
        *   **如果成功：** `sitemap.xml` 中必须出现 `/app/test1/`, `/app/test2/`, `/app/test3/`。这证明库的核心功能是好的，问题出在与文件系统的交互上。**我们可以进入第 2 阶段。**
        *   **如果失败：** 证明问题出在 `next-sitemap` 与您项目其他配置的深层冲突上。**计划终止，我们需要考虑替代方案。**

*   **行动：**
    1.  **我将创建一个名为 `.sitemap-paths.json` 的文件**，并放置在项目根目录。其内容如下，包含了与第一阶段完全不同的路径，以便区分：
        ```json
        [
          "/app/jason1/",
          "/app/jason2/",
          "/app/jason3/"
        ]
        ```
    2.  **我将修改 `next-sitemap.config.js`**，使其从硬编码逻辑改回从 `.sitemap-paths.json` 读取和解析数据，并**加强日志记录**。

*   **检验标准：**
    *   **验证方法：** 部署后，首先检查 Vercel 构建日志，确认文件被成功读取的日志已打印。然后检查 `sitemap.xml` 文件。
    *   **预期行为：**
        *   **如果成功：** `sitemap.xml` 中必须出现 `/app/jason1/`, `/app/jason2/`, `/app/jason3/`。这证明库能正确进行文件读写，问题可能出在“先写后读”的时间差或权限上。**我们可以进入第 3 阶段。**
        *   **如果失败：** 证明库的核心功能虽好，但它在 GitHub Actions 环境中无法正确访问文件系统。**计划终止，我们需要考虑替代方案。**

### 第 2 阶段：本地文件读取测试

**前置条件：** 第 1 阶段必须成功。

**目标：** 验证 `next-sitemap` 在构建环境中，是否能成功读取一个放置在项目根目录的、手動製造的 JSON 文件。

*   **行动：**
    1.  **请您确认**服务器上 `https://tianfei.chat/app/sitemap-paths.txt` 文件存在且内容正确。
    2.  **我将引入 `scripts/generate-sitemap-paths.js` 脚本**，它负责获取远程 txt 文件，并生成 `.sitemap-paths.json`。
    3.  **我将修改 GitHub Actions 工作流**，在 `next build` 之前，增加一个步骤来运行这个脚本。**该步骤还将包含文件系统的物理检查命令**。
        ```yaml
        # ... (in GitHub Actions workflow)
        - name: Generate sitemap paths from external source
          run: node scripts/generate-sitemap-paths.js
        
        - name: Verify sitemap paths file
          run: |
            echo "Verifying file system before build..."
            ls -la
            cat .sitemap-paths.json
        
        - name: Build Next.js
          run: next build
        # ...
        ```

*   **检验标准：**
    *   **验证方法：** 部署后，首先检查 GitHub Actions 日志，确认 `Verify sitemap paths file` 步骤成功执行且打印出正确的文件内容。然后检查 `sitemap.xml` 文件。
    *   **预期行为：**
        *   **如果成功：** `sitemap.xml` 中出现您在 `sitemap-paths.txt` 中配置的所有路径。**任务最终完成！**
        *   **如果失败：** 证明问题出在“脚本生成文件”和“sitemap读取文件”这两个步骤的衔接上（例如，文件被 `next build` 清理）。**计划终止，我们需要考虑替代方案。**

### 第 3 阶段：完整动态流程测试

**前置条件：** 第 2 阶段必须成功。

**目标：** 验证我们最初的、完整的动态流程（从远程服务器读取 txt -> 生成 json -> sitemap 读取 json）是否可行。

*   **完全抛弃 `next-sitemap` 的 `additionalPaths` 功能。**
*   **修改我们的 `scripts/generate-sitemap-paths.js` 脚本**，使其承担起生成完整 Sitemap 的职责。
    *   **具体步骤**：
        1.  脚本首先从 Notion 拉取项目内已有页面路径。
        2.  接着，脚本获取远程 `sitemap-paths.txt` 的外部路径。
        3.  使用一个可靠的库（如 `sitemap`），将两组路径合并，并生成一个完整的、符合规范的 `sitemap.xml` 文件。
        4.  最后，将这个生成的文件**直接覆盖**到 `public/sitemap.xml`。
    *   **优势**：此方案绕开了 `next-sitemap` 的所有黑盒问题，我们将对 Sitemap 的生成拥有完全、透明的控制权。

---
## 替代方案 (如果以上任何一步最终失败)

如果我们的侦察计划最终确认 `next-sitemap` 在当前环境下不可靠，备选的“B计划”是：

*   **完全抛弃 `next-sitemap` 的 `additionalPaths` 功能。**
*   **修改我们的 `scripts/generate-sitemap-paths.js` 脚本**，使其承担起生成完整 Sitemap 的职责。
    *   **具体步骤**：
        1.  脚本首先从 Notion 拉取项目内已有页面路径。
        2.  接着，脚本获取远程 `sitemap-paths.txt` 的外部路径。
        3.  使用一个可靠的库（如 `sitemap`），将两组路径合并，并生成一个完整的、符合规范的 `sitemap.xml` 文件。
        4.  最后，将这个生成的文件**直接覆盖**到 `public/sitemap.xml`。
    *   **优势**：此方案绕开了 `next-sitemap` 的所有黑盒问题，我们将对 Sitemap 的生成拥有完全、透明的控制权。