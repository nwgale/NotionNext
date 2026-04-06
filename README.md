## 2026-04-06 空站故障复盘（tianfei.chat）

### 现象
- 网站构建成功但首页内容为空，`posts` 列表变成空数组，最终发布了“空站”。

### 根因
- 本次不是 Notion 数据库内容被改坏，而是 Notion 接口返回结构发生了波动：
  - `collection_query` 可能为空对象 `{}`。
  - 但 `collection_view.page_sort` 里仍然有文章 ID。
- 旧逻辑强依赖 `collection_query[collectionId][viewId]`，当它缺失时会导致拿不到 `pageIds`，进而得到空内容。

### 已修复内容
- 代码层容错（`lib/notion/getAllPageIds.js`）
  - 读取 `collection_query` 改为安全访问，不再因为缺字段崩溃。
  - 主路径取不到文章时，先回退遍历 `collection_query`。
  - 若 `collection_query` 仍为空，再回退到 `collection_view.page_sort` 恢复 `pageIds`。
- 构建层兜底（`lib/db/getSiteData.js`）
  - 在 `CI/EXPORT` 环境下，只要出现 fallback 数据或空数据，直接抛错终止构建。
- 部署层阻断（`.github/workflows/deploy-to-domestic.yml`）
  - 增加 `Validate build data health`：
    - `out/index.html` 无 `__NEXT_DATA__` 直接失败。
    - `posts` 为空直接失败。
    - 出现 `oops-error-page` fallback 直接失败。

### 为什么“什么都没改又坏了”
- 因为我们依赖的是 Notion 的非官方稳定契约字段，接口偶发返回差异（字段缺失或形态变化）是可能发生的。
- 旧实现对单一字段路径过于依赖，导致“上游轻微波动 -> 下游空站”。

### 如何确保下次不再发生同类问题
- 保障机制已经是三层：
  - 数据获取层：多路径回退拿 `pageIds`。
  - 构建层：空数据/fallback 直接 fail build。
  - 发布层：部署前健康检查，不健康就禁止 rsync 发布。
- 结果是：即便未来 Notion 再次波动，最坏情况也会“部署失败并保留旧站”，而不是“发布空站”。

### 运维建议
- 每次故障先看 GitHub Actions 的 `Validate build data health` 步骤。
- 该步骤失败时优先看日志中的以下关键词：
  - `collectionQueryTopKeys`
  - `Recovered pageIds from collection_view.page_sort`
  - `Final pageIds is empty`
  - `Fallback post detected`

基于我阅读的文档和代码，我对这个NotionNext项目有了比较深入的理解。这是一个功能丰富的静态博客系统，具有以下特点：
项目概述
NotionNext是一个基于Next.js和Notion API的静态博客系统，可以将Notion页面内容自动生成美观的个人博客。它支持双部署策略：
Vercel部署（供国外访问）：自动更新
阿里云部署（供国内访问）：通过GitHub Actions手动更新
核心功能
多主题支持：包括Next、Medium、Hexo等多种主题风格
评论系统集成：支持Twikoo、Giscus、Utterances、Gitalk、Cusdis等多种评论组件
SEO优化：支持规范链接(rel="canonical")、Sitemap生成、RSS输出
搜索功能：集成Algolia搜索
响应式设计：支持暗黑模式、动画效果
静态化部署：支持完全静态化导出并部署到国内服务器
技术架构
前端框架：Next.js + React + TypeScript
样式：Tailwind CSS
内容渲染：react-notion-x解析Notion API数据
部署：Vercel自动部署 + GitHub Actions同步到国内服务器
缓存机制：支持内存缓存、文件缓存和Redis缓存
自定义改造亮点
通过阅读文档，我发现项目进行了多项深度定制：
1. 双部署SEO优化
实现了规范链接(rel="canonical")功能，解决双部署带来的SEO问题
Vercel部署指向阿里云作为主版本，避免重复内容权重分散
2. 教育版页面功能
新增了PageEdu类型页面，具有独立的布局和样式
EduLayout组件提供无导航栏的纯净页面体验
支持自定义背景图片、标题和描述
3. 构建优化
解决了Notion API 530错误问题，通过配置备用API地址
优化了构建时API调用，避免429错误，通过内存缓存将API调用从上百次减少到1次
修复了Sitemap生成机制，确保时间戳准确性和路径去重
4. 部署优化
通过GitHub Actions实现自动化部署到国内服务器
解决了Vercel部署中Serverless Function体积超限问题
配置了SSH密钥认证实现免密部署
5. 评论系统集成
集成了Cusdis和Twikoo两套评论系统
支持子路径部署配置
项目优势
内容管理便捷：直接使用Notion作为CMS，无需额外学习成本
部署灵活：支持多种部署方式，适应不同网络环境
性能优化：多级缓存机制，减少API调用
可定制性强：丰富的配置选项和主题支持
本土化适配：针对国内网络环境进行了专门优化
总的来说，这是一个经过深度定制和优化的基于我阅读的文档和代码，我对这个NotionNext项目有了比较全面的理解。这是一个非常有趣且功能丰富的项目，让我来总结一下：
项目概述
NotionNext是一个基于Next.js和Notion API的静态博客系统，可以将Notion页面内容自动生成美观的个人博客。项目具有以下核心特点：
技术架构
框架: Next.js (React + TypeScript)
样式: Tailwind CSS
内容渲染: react-notion-x库解析Notion API数据
部署: 支持Vercel自动部署和阿里云手动部署的双部署策略
核心功能
多主题支持: 包含Next、Medium、Hexo等多种主题风格
评论系统集成: 支持Twikoo、Giscus、Utterances、Gitalk等多种评论组件
SEO优化: 支持Algolia搜索、Sitemap生成、RSS输出、规范链接(rel="canonical")等
静态化部署: 可将网站完全静态化并同步到国内服务器，解决国内访问慢的问题
项目的独特改造
从文档中可以看出，这个项目进行了很多深度定制化改造：
1. 双部署优化
Vercel部署: 供国外用户访问，自动更新
阿里云部署: 供国内用户访问，通过GitHub Actions手动更新
规范链接实现: 通过rel="canonical"解决SEO重复内容问题
2. 教育版页面功能
新增了PageEdu类型，专门用于教育场景
实现了独立的EduLayout和EduHeader组件
支持自定义背景图片、标题和描述
3. 性能优化
API调用优化: 通过构建时内存缓存避免重复请求Notion API
Sitemap优化: 实现了三步流水线校准机制，确保时间戳准确
Vercel部署优化: 通过outputFileTracingExcludes解决Serverless Function体积超限问题
4. 评论系统集成
集成了Cusdis和Twikoo两种评论系统
实现了完整的后台管理和维护文档
技术亮点
1. 构建时缓存机制
通过全局内存缓存，将Notion API请求从上百次减少到1次，彻底解决429错误。
2. Sitemap三步流水线
第1步：生成可信的时间戳缓存
第2步：利用next-sitemap扫描内部路径
第3步：校准时间戳并合并外部路径
3. 自动化部署流程
通过GitHub Actions实现代码推送后自动构建静态网站并部署到阿里云服务器。
4. 灵活的配置系统
支持通过Notion数据库、环境变量、配置文件三层配置，满足不同场景需求。
项目价值
这个项目解决了几个重要问题：
国内外访问速度差异: 通过双部署策略优化用户体验
内容管理便利性: 利用Notion作为CMS，降低内容创作门槛
SEO优化: 通过规范链接等技术提升搜索引擎排名
部署灵活性: 支持多种部署方式，适应不同用户需求
总的来说，这是一个非常成熟的开源博客解决方案，特别是在针对中国用户访问体验方面做了大量优化工作，体现了开发者对实际使用场景的深度理解和技术创新能力。
