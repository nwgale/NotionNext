# PRD: 优化 Notion API 调用以提升构建稳定性与速度

> [!TIP]
> **Recon Before Action (行动前侦察)**
> 本文档旨在解决 `next build` 过程中因重复请求 Notion API 导致的 `429 Too Many Requests` 错误，该问题已严重影响构建的稳定性和速度。

## 1. 背景 (Background)

### 1.1. 问题描述
在执行 `next build` 命令时，Next.js 的底层机制会为网站的每个页面（文章、标签页、分类页等）频繁调用数据获取函数 `getGlobalData`。目前的代码实现导致每一次调用都会最终触发对 Notion API 的请求。

### 1.2. 根本原因
随着博客文章、标签和分类数量的增加，构建时需要生成的页面总数也随之增多，导致对 `getGlobalData` 的调用次数达到上百次。这在短时间内产生了密集的 API 请求，最终触发了 Notion 服务器的速率限制 (`429 Too Many Requests` 错误)，导致构建失败。

### 1.3. 关联症状
- **日志刷屏**: 构建日志中出现上百条 `[Build] lastmod-map.json updated...` 的记录，这正是 `getGlobalData` 被频繁调用的直接证据。
- **构建缓慢**: 大量的网络请求和文件I/O操作拖慢了整体构建速度。

## 2. 目标 (Goal)

通过实施**构建时内存缓存 (Build-time In-Memory Cache)**，将整个 `next build` 过程中的 Notion API 数据请求次数从**上百次**锐减到 **1 次**。

- **核心目标**: 根治 `429` 错误，确保构建流程 100% 稳定。
- **次要目标**: 大幅提升构建速度，并清理构建日志中的重复信息。

## 3. 可交付成果 (Testable Deliverables)

1.  **一份修改后的代码文件**:
    -   `lib/db/getSiteData.js`
2.  **可验证的日志行为**:
    -   构建日志中，表明“首次获取数据并存入缓存”的日志**只出现 1 次**。
    -   构建日志中，表明“从内存缓存获取数据”的日志**出现多次**。
    -   构建日志中，`429 Too Many Requests` 错误**完全消失**。
    -   构建日志中，`lastmod-map.json updated` 的日志**只出现 1 次**。
3.  **一个稳定且内容完整的线上网站**。

## 4. 方案 (Solution)

### 核心思路：只取一次，存入水缸

我们将利用 Node.js 进程在单次构建命令中共享内存的特性，创建一个全局变量作为“水缸”（缓存）。

1.  **第一次**调用 `getGlobalData` 时，发现“水缸”是空的。
2.  执行完整的取水流程（请求 Notion API），获取所有网站数据。
3.  将这桶完整的数据**倒入“水缸”**（存入全局缓存）。
4.  **后续所有**对 `getGlobalData` 的调用，都直 接从“水缸”里取水，不再去远方的 Notion API。

### 实施步骤 (Implementation Steps)

- **[修改]** `lib/db/getSiteData.js` 文件中的 `getGlobalData` 函数。
    1.  在函数入口处，增加对全局缓存变量 `global.__GLOBAL_DATA_CACHE__` 的检查。
    2.  **如果缓存存在**：深度克隆 (`deepClone`) 并直接 `return` 缓存中的数据。增加一条日志，如 `[Build Cache] Hit: Returning data from in-memory cache.`。
    3.  **如果缓存不存在**：
        -   执行现有的、完整的数据获取逻辑。
        -   在获取到 `data` 后，**将其存入 `global.__GLOBAL_DATA_CACHE__ = data`**。
        -   增加一条日志，如 `[Build Cache] Miss: Fetched data and cached in memory.`。
        -   返回 `data`。

## 5. 验收标准 (PM Acceptance Criteria)

1.  **[通过]** 提交代码后，在 GitHub Actions 的构建日志中搜索：
    -   `[Build Cache] Miss` 相关的日志**仅出现 1 次**。
    -   `[Build Cache] Hit` 相关的日志**出现 N 次** (N > 1)。
    -   `429` 关键字的搜索结果为 **0**。
    -   `lastmod-map.json` 相关的日志**仅出现 1 次**。
2.  **[通过]** 构建流程成功完成，没有因 API 请求问题而中断。
3.  **[通过]** 部署成功后，访问线上网站，所有页面（首页、文章页、归档页等）内容均显示正常、完整。