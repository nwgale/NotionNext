# Fork本项目后要注意的清单

当你fork本项目并连接到另一个Notion数据库以创建自己的网站时，需要注意以下几个关键方面：

## 1. Notion配置

### 1.1 Notion数据库设置
- [ ] 复制原始Notion数据库模板到你的Notion workspace
- [ ] 获取新的`NOTION_PAGE_ID`（数据库ID）
- [ ] 确保数据库中的字段名与项目配置一致
- [ ] 设置数据库为公开访问或配置`NOTION_TOKEN_V2`

### 1.2 Notion内容准备
- [ ] 添加必要的配置页面（如站点信息、页脚链接等）
- [ ] 创建测试文章确保内容显示正常
- [ ] 配置教育版页面相关字段（如需要）

## 2. GitHub配置

### 2.1 仓库设置
- [ ] 修改仓库名称为你的项目名称
- [ ] 更新README.md中的项目信息
- [ ] 删除或更新自定义修改说明文档中的个人信息

### 2.2 Secrets配置
在GitHub仓库的`Settings > Secrets and variables > Actions`中添加以下Secrets：

- [ ] `NOTION_PAGE_ID`: 你的Notion数据库ID
- [ ] `API_BASE_URL`: 你的个性化Notion API域名（如需要）
- [ ] `REMOTE_HOST`: 阿里云服务器IP（如使用国内部署）
- [ ] `REMOTE_USER`: 服务器用户名（如root）
- [ ] `REMOTE_SSH_KEY`: SSH私钥（用于部署到国内服务器）
- [ ] `REMOTE_TARGET_DIR`: 服务器目标目录

## 3. Vercel配置

### 3.1 项目创建
- [ ] 在Vercel中导入你的GitHub仓库
- [ ] 配置项目名称和根目录

### 3.2 环境变量设置
在Vercel项目的`Settings > Environment Variables`中添加以下环境变量：

- [ ] `NOTION_PAGE_ID`: 你的Notion数据库ID
- [ ] `NEXT_PUBLIC_THEME`: 主题名称（如simpleFeittt）
- [ ] `NEXT_PUBLIC_LANG`: 语言（如zh-CN）
- [ ] `API_BASE_URL`: 你的个性化Notion API域名（如需要）
- [ ] `NEXT_PUBLIC_CANONICAL_DOMAIN`: 你的主域名（用于规范链接）
- [ ] `NEXT_PUBLIC_IS_CANONICAL_HOST`: false（Vercel部署不是规范主机）

### 3.3 评论系统配置（如需要）
- [ ] `NEXT_PUBLIC_COMMENT_CUSDIS_APP_ID`: Cusdis应用ID
- [ ] `NEXT_PUBLIC_COMMENT_CUSDIS_HOST`: Cusdis主机地址
- [ ] `NEXT_PUBLIC_COMMENT_CUSDIS_SCRIPT_SRC`: Cusdis脚本地址

## 4. 域名配置

### 4.1 国外访问（Vercel）
- [ ] 在Vercel中配置自定义域名
- [ ] 在域名提供商处设置DNS记录指向Vercel

### 4.2 国内访问（阿里云）
- [ ] 购买并备案域名
- [ ] 配置Nginx反向代理指向静态文件目录
- [ ] 设置DNS解析到阿里云服务器

## 5. 代码修改

### 5.1 配置文件
- [ ] 修改`blog.config.js`中的默认配置（TITLE, AUTHOR, LINK等）
- [ ] 更新页脚链接配置（FOOTER_LINK1-4）
- [ ] 调整教育版页面配置（如需要）

### 5.2 主题定制
- [ ] 选择合适的主题或自定义现有主题
- [ ] 调整颜色、字体等样式配置
- [ ] 修改头部和页脚内容

### 5.3 删除个人定制内容
- [ ] 删除或修改与原作者相关的内容
- [ ] 更新版权信息
- [ ] 移除或替换个人联系方式

## 6. 部署验证

### 6.1 Vercel部署验证
- [ ] 确认Vercel自动部署成功
- [ ] 检查网站基本功能是否正常
- [ ] 验证文章列表和详情页显示正常
- [ ] 检查SEO相关功能（sitemap, robots.txt等）

### 6.2 国内部署验证（如配置）
- [ ] 手动触发GitHub Actions部署流程
- [ ] 检查国内站点是否正常访问
- [ ] 验证图片加载速度
- [ ] 确认评论系统正常工作

## 7. 后续维护

### 7.1 内容更新
- [ ] 在Notion中添加新文章测试更新流程
- [ ] 验证Vercel自动部署是否正常工作
- [ ] 如使用国内部署，测试手动触发部署流程

### 7.2 安全配置
- [ ] 定期更新依赖包
- [ ] 备份重要配置和数据
- [ ] 监控网站性能和错误日志

### 7.3 功能扩展
- [ ] 根据需要添加新的功能模块
- [ ] 集成其他第三方服务
- [ ] 优化网站性能和用户体验

## 8. 常见问题排查

### 8.1 构建失败
- [ ] 检查NOTION_PAGE_ID是否正确
- [ ] 确认Notion数据库是否可访问
- [ ] 验证API_BASE_URL配置（如使用个性化域名）

### 8.2 内容不显示
- [ ] 检查文章状态是否为Published
- [ ] 确认文章类型配置正确
- [ ] 验证字段映射配置

### 8.3 部署问题
- [ ] 检查GitHub Actions配置和日志
- [ ] 验证SSH密钥和服务器连接
- [ ] 确认Nginx配置正确

通过按照这个清单逐一检查和配置，你应该能够成功fork本项目并创建属于自己的NotionNext网站。