# NotionNext双部署规范链接实现 PRD

## 1. 项目概述

### 1.1 背景

NotionNext项目目前采用双部署策略：
- Vercel部署（供国外访问）：自动更新，域名blogtianfei.vercel.app
- 阿里云部署（供国内访问）：通过GitHub Actions手动更新，域名tianfei.chat

这种双部署策略导致相同内容在两个不同域名下存在，搜索引擎会将它们视为重复内容，导致搜索排名权重被分散，影响整体SEO表现。

### 1.2 目标

通过实现规范链接(rel="canonical")，明确告知搜索引擎哪个版本是"主版本"，解决双部署带来的SEO问题：
1. 在Vercel部署的页面中添加指向阿里云域名的规范链接
2. 在阿里云部署的页面中添加自引用的规范链接
3. 确保所有页面都正确添加了规范链接

### 1.3 非目标

1. 不修改NotionNext的核心功能和用户体验
2. 不实现301重定向（保留两个部署的独立访问能力）
3. 不涉及其他SEO优化措施

## 2. 需求详情

### 2.1 功能需求

1. **配置规范域名**：在配置文件中添加规范域名设置
2. **动态生成规范链接**：根据当前页面路径动态生成规范链接
3. **区分部署环境**：在不同部署环境（Vercel和阿里云）中使用不同的规范链接策略
4. **处理特殊URL**：正确处理带查询参数的URL和特殊路径

### 2.2 技术需求

1. 修改应在现有代码结构基础上进行，不引入新的依赖
2. 通过环境变量区分不同部署环境
3. 确保规范链接在所有页面类型（首页、文章页、分类页等）上正确生成

## 3. 技术方案

### 3.1 修改文件

需要修改的文件：
1. `blog.config.js` - 添加规范链接相关配置
2. `components/SEO.js` - 实现规范链接标签生成
3. `.github/workflows/deploy-to-domestic.yml` - 添加环境变量配置

### 3.2 配置项

在`blog.config.js`中添加以下配置项：
```javascript
// 规范链接配置
CANONICAL_DOMAIN: process.env.NEXT_PUBLIC_CANONICAL_DOMAIN || 'https://tianfei.chat', // 规范链接的域名
IS_CANONICAL_HOST: process.env.NEXT_PUBLIC_IS_CANONICAL_HOST === 'true', // 是否为规范主机(阿里云)
```

### 3.3 环境变量设置

- Vercel部署：
  - `NEXT_PUBLIC_CANONICAL_DOMAIN`: `https://tianfei.chat`
  - `NEXT_PUBLIC_IS_CANONICAL_HOST`: `false`

- 阿里云部署：
  - `NEXT_PUBLIC_CANONICAL_DOMAIN`: `https://tianfei.chat`
  - `NEXT_PUBLIC_IS_CANONICAL_HOST`: `true`

## 4. 实施计划

### 4.1 开发阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 修改blog.config.js添加规范链接配置 | 配置项正确添加到文件中 | 0.5小时 |
| 2 | 修改SEO.js组件添加规范链接生成逻辑 | 规范链接标签正确生成 | 1小时 |
| 3 | 修改GitHub Actions工作流添加环境变量 | 环境变量正确添加到工作流文件中 | 0.5小时 |
| 4 | 配置Vercel环境变量 | Vercel项目设置中环境变量正确配置 | 0.5小时 |

### 4.2 测试阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 本地测试 | 本地运行项目，检查规范链接是否正确生成 | 1小时 |
| 2 | Vercel部署测试 | 部署到Vercel，检查规范链接是否指向阿里云域名 | 1小时 |
| 3 | 阿里云部署测试 | 部署到阿里云，检查规范链接是否自引用 | 1小时 |

### 4.3 部署阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 部署到Vercel | Vercel自动部署成功 | 0.5小时 |
| 2 | 部署到阿里云 | GitHub Actions工作流执行成功 | 0.5小时 |
| 3 | 验证部署效果 | 两个部署环境的规范链接正确生成 | 1小时 |

## 5. 具体实现步骤

### 5.1 修改blog.config.js

1. 打开`blog.config.js`文件
2. 在文件末尾、`module.exports = BLOG`语句之前添加以下配置项：
   ```javascript
   // 规范链接配置
   CANONICAL_DOMAIN: process.env.NEXT_PUBLIC_CANONICAL_DOMAIN || 'https://tianfei.chat', // 规范链接的域名
   IS_CANONICAL_HOST: process.env.NEXT_PUBLIC_IS_CANONICAL_HOST === 'true', // 是否为规范主机(阿里云)
   ```

**可测试标准**：
1. 检查`blog.config.js`文件是否包含新添加的配置项
2. 确认配置项的默认值设置正确（默认域名为`https://tianfei.chat`）

### 5.2 修改components/SEO.js

1. 打开`components/SEO.js`文件
2. 在SEO组件中，找到`<Head>`标签内的合适位置（例如在其他meta标签附近）
3. 添加以下代码：
   ```javascript
   // 获取规范域名和当前路径
   const CANONICAL_DOMAIN = siteConfig('CANONICAL_DOMAIN')
   const currentPath = router.asPath
   // 处理路径，移除查询参数
   let canonicalPath = currentPath
   if (canonicalPath.includes('?')) {
     canonicalPath = canonicalPath.split('?')[0]
   }
   // 构建完整的规范URL
   const canonicalUrl = `${CANONICAL_DOMAIN}${canonicalPath}`

   // 在<Head>标签内添加，放在其他meta标签附近
   <link rel="canonical" href={canonicalUrl} />
   ```

**可测试标准**：
1. 在本地运行项目（`npm run dev`）
2. 打开浏览器访问本地项目（通常是http://localhost:3000）
3. 右键点击页面，选择"查看页面源代码"
4. 搜索"canonical"，确认页面中包含类似以下的标签：
   ```html
   <link rel="canonical" href="https://tianfei.chat/">
   ```
5. 导航到不同页面（如文章页、分类页），重复步骤3-4，确认规范链接正确生成

### 5.3 修改GitHub Actions工作流

1. 打开`.github/workflows/deploy-to-domestic.yml`文件
2. 找到构建静态文件的环境变量配置部分
3. 添加以下环境变量：
   ```yaml
   # 在env部分添加
   NEXT_PUBLIC_CANONICAL_DOMAIN: 'https://tianfei.chat'
   NEXT_PUBLIC_IS_CANONICAL_HOST: 'true'
   ```

**可测试标准**：
1. 检查`.github/workflows/deploy-to-domestic.yml`文件是否包含新添加的环境变量
2. 确认环境变量的值设置正确（`NEXT_PUBLIC_CANONICAL_DOMAIN`为`https://tianfei.chat`，`NEXT_PUBLIC_IS_CANONICAL_HOST`为`true`）

### 5.4 配置Vercel环境变量

1. 登录Vercel控制台（https://vercel.com/）
2. 选择NotionNext项目
3. 点击"Settings"标签
4. 在左侧菜单中选择"Environment Variables"
5. 添加以下环境变量：
   - 名称：`NEXT_PUBLIC_CANONICAL_DOMAIN`，值：`https://tianfei.chat`
   - 名称：`NEXT_PUBLIC_IS_CANONICAL_HOST`，值：`false`
6. 点击"Save"保存环境变量

**可测试标准**：
1. 在Vercel控制台中，检查项目的环境变量设置
2. 确认`NEXT_PUBLIC_CANONICAL_DOMAIN`和`NEXT_PUBLIC_IS_CANONICAL_HOST`环境变量已添加并值正确
3. 重新部署Vercel项目（点击"Deployments"标签，然后点击"Redeploy"）

## 6. 验收标准

### 6.1 Vercel部署验收

1. 访问Vercel部署的网站（例如https://blogtianfei.vercel.app/）
2. 右键点击页面，选择"查看页面源代码"
3. 搜索"canonical"，确认规范链接指向阿里云域名：
   ```html
   <link rel="canonical" href="https://tianfei.chat/">
   ```
4. 导航到不同页面（如文章页、分类页），重复步骤2-3，确认所有页面的规范链接都正确指向阿里云域名对应页面

### 6.2 阿里云部署验收

1. 访问阿里云部署的网站（https://tianfei.chat/）
2. 右键点击页面，选择"查看页面源代码"
3. 搜索"canonical"，确认规范链接自引用：
   ```html
   <link rel="canonical" href="https://tianfei.chat/">
   ```
4. 导航到不同页面（如文章页、分类页），重复步骤2-3，确认所有页面的规范链接都正确自引用

### 6.3 特殊情况验收

1. 访问带查询参数的URL（如https://blogtianfei.vercel.app/search?keyword=test）
2. 查看页面源代码，确认规范链接中不包含查询参数：
   ```html
   <link rel="canonical" href="https://tianfei.chat/search">
   ```

## 7. 风险与缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 规范链接格式错误 | 搜索引擎无法识别规范版本 | 确保使用完整的绝对URL，包含https://前缀 |
| 部分页面缺少规范链接 | 部分内容仍被视为重复 | 在SEO.js组件中统一处理，确保所有页面都添加规范链接 |
| 环境变量配置错误 | 规范链接指向错误域名 | 部署前仔细检查环境变量配置，部署后验证规范链接 |
| 动态路由页面规范链接不正确 | 特定页面SEO效果不佳 | 确保router.asPath处理逻辑正确处理所有类型的路径 |

## 8. 未来扩展

1. **规范链接监控**：添加自动检测工具，定期检查规范链接是否正确生成
2. **SEO报告集成**：与Google Search Console和百度搜索资源平台集成，监控规范链接效果
3. **多语言支持**：针对多语言网站，优化规范链接处理逻辑
4. **AMP页面支持**：如果未来添加AMP页面，确保AMP页面也有正确的规范链接

## 9. 附录

### 9.1 规范链接最佳实践

1. **使用绝对URL**：规范链接必须使用完整的绝对URL，包含https://前缀
2. **一致性**：每个页面只能有一个规范链接标签
3. **自引用**：主版本页面的规范链接应指向自身
4. **HTTPS优先**：规范链接应优先使用HTTPS版本
5. **移除查询参数**：通常应在规范链接中移除查询参数

### 9.2 参考资料

- [Google: Consolidate duplicate URLs](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls)
- [Canonical URL Tag - SEO Best Practices](https://moz.com/learn/seo/canonicalization)
- [Next.js SEO: The Ultimate Guide](https://www.netlify.com/blog/2020/06/10/next-js-seo-the-ultimate-guide/)