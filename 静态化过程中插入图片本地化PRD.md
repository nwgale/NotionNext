# 静态化过程中插入图片本地化 PRD

## 1. 项目概述

### 1.1 背景

NotionNext项目目前采用双部署策略：
- Vercel部署（供国外访问）：自动更新，域名blogtianfei.vercel.app
- 阿里云部署（供国内访问）：通过GitHub Actions手动更新，域名tianfei.chat

当前的静态化方案将HTML内容部署到阿里云服务器，但图片仍然使用Notion的原始链接。这导致国内用户访问网站时，图片加载速度慢，影响整体用户体验。

### 1.2 目标

为阿里云部署优化图片访问速度，同时保持Vercel部署的原有流程不变：
1. 保持Vercel部署使用原始Notion图片链接
2. 只在部署到阿里云时执行图片本地化流程
3. 修改GitHub Actions工作流，在rsync前增加图片处理步骤

### 1.3 非目标

1. 不修改Vercel部署流程
2. 不处理视频、音频等其他媒体资源的本地化
3. 不改变NotionNext的核心代码结构

## 2. 需求详情

### 2.1 功能需求

1. **图片URL提取**：从生成的静态HTML文件中提取所有Notion图片URL
2. **图片下载**：将提取的图片下载到本地目录
3. **路径替换**：在HTML文件中将Notion图片URL替换为本地路径
4. **增量处理**：支持只处理新增或修改的图片，避免重复下载
5. **错误处理**：处理图片下载失败的情况，提供日志和重试机制

### 2.2 技术需求

1. 脚本应使用Node.js编写，便于集成到现有的Next.js项目中
2. 脚本应作为GitHub Actions工作流的一部分执行
3. 下载的图片应存储在`out/images/notion/`目录下
4. 图片文件名应基于原URL的哈希值，以避免文件名冲突
5. 脚本应支持并发下载，提高处理速度

### 2.3 性能需求

1. 图片处理不应显著增加部署时间（目标：增加不超过5分钟）
2. 支持处理至少1000张图片
3. 下载失败的图片应不影响整体部署流程

## 3. 技术方案

### 3.1 整体架构

```
NotionNext项目
├── scripts/
│   └── localize-images.js  # 新增：图片本地化脚本
├── .github/
│   └── workflows/
│       └── deploy-to-domestic.yml  # 修改：增加图片本地化步骤
└── out/  # 静态导出目录
    ├── images/
    │   └── notion/  # 新增：本地化的Notion图片
    └── [其他静态文件]
```

### 3.2 处理流程

1. 执行`npm run export`生成静态文件
2. 执行图片本地化脚本`node scripts/localize-images.js`
3. 将处理后的静态文件部署到阿里云服务器

### 3.3 技术细节

#### 3.3.1 图片URL提取

使用正则表达式或HTML解析库（如cheerio）从HTML文件中提取图片URL：

```javascript
// 提取Notion域名下的图片URL
const notionImageRegex = /https:\/\/(www\.)?notion\.so\/image\/[^"'\s]+/g;
```

#### 3.3.2 图片下载与存储

使用Node.js的`https`模块或第三方库（如axios）下载图片：

```javascript
// 下载图片并存储到本地
async function downloadImage(url, localPath) {
  const response = await axios({
    url,
    responseType: 'stream'
  });
  
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

#### 3.3.3 路径替换

使用文件系统操作替换HTML中的图片路径：

```javascript
// 替换HTML文件中的图片URL
function replaceImageUrls(htmlFilePath, urlMap) {
  let content = fs.readFileSync(htmlFilePath, 'utf8');
  
  for (const [originalUrl, localUrl] of Object.entries(urlMap)) {
    content = content.replace(new RegExp(escapeRegExp(originalUrl), 'g'), localUrl);
  }
  
  fs.writeFileSync(htmlFilePath, content);
}
```

## 4. 实施计划

### 4.1 开发阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 创建图片本地化脚本框架 | 脚本可执行并输出日志 | 0.5天 |
| 2 | 实现HTML文件扫描功能 | 能正确列出所有HTML文件 | 0.5天 |
| 3 | 实现图片URL提取功能 | 能从HTML中提取所有Notion图片URL | 1天 |
| 4 | 实现图片下载功能 | 能将图片下载到指定目录 | 1天 |
| 5 | 实现URL替换功能 | 能在HTML中替换图片URL | 1天 |
| 6 | 实现增量处理功能 | 能识别并仅处理新增/修改的图片 | 1天 |
| 7 | 实现错误处理和日志 | 能处理下载失败情况并记录日志 | 0.5天 |
| 8 | 修改GitHub Actions工作流 | 工作流中包含图片本地化步骤 | 0.5天 |

### 4.2 测试阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 单元测试 | 各功能模块通过测试 | 1天 |
| 2 | 集成测试 | 完整流程能正常工作 | 1天 |
| 3 | 性能测试 | 处理大量图片时性能符合要求 | 0.5天 |
| 4 | 手动触发部署测试 | GitHub Actions工作流能正常执行 | 0.5天 |

### 4.3 部署阶段

| 步骤 | 描述 | 可测试标准 | 预计时间 |
|------|------|------------|----------|
| 1 | 部署到测试环境 | 测试环境中图片能正常显示 | 0.5天 |
| 2 | 部署到生产环境 | 生产环境中图片能正常显示 | 0.5天 |
| 3 | 监控和优化 | 收集性能数据并进行必要优化 | 1天 |

## 5. 具体实现步骤

### 5.1 创建图片本地化脚本

1. 在项目根目录创建`scripts`文件夹（如果不存在）
2. 创建`scripts/localize-images.js`文件
3. 实现以下功能：
   - 命令行参数解析
   - 配置项（如图片存储路径、并发数等）
   - 日志记录

**可测试标准**：脚本可以通过`node scripts/localize-images.js --help`显示帮助信息

### 5.2 实现HTML文件扫描

1. 使用`fs.promises.readdir`递归扫描`out`目录
2. 过滤出所有HTML文件（`.html`后缀）
3. 返回文件路径列表

**可测试标准**：脚本能正确列出`out`目录下所有HTML文件

### 5.3 实现图片URL提取

1. 读取HTML文件内容
2. 使用正则表达式匹配Notion图片URL
3. 去重并返回URL列表

**可测试标准**：脚本能从测试HTML文件中提取所有Notion图片URL

### 5.4 实现图片下载功能

1. 创建`out/images/notion`目录（如果不存在）
2. 根据图片URL生成唯一文件名（使用URL的MD5哈希）
3. 下载图片并保存到本地
4. 实现并发下载控制

**可测试标准**：脚本能将指定URL的图片下载到本地目录

### 5.5 实现URL替换功能

1. 创建原始URL到本地URL的映射
2. 读取HTML文件内容
3. 替换所有匹配的URL
4. 写回HTML文件

**可测试标准**：替换后的HTML文件中，图片链接指向本地路径

### 5.6 实现增量处理功能

1. 创建缓存文件记录已处理的图片URL和时间戳
2. 检查图片是否已存在且未过期
3. 只下载新增或修改的图片

**可测试标准**：第二次运行脚本时，已下载的图片不会重复下载

### 5.7 实现错误处理和日志

1. 使用try-catch捕获下载和处理错误
2. 记录详细日志，包括成功、警告和错误信息
3. 实现重试机制，对失败的下载尝试多次

**可测试标准**：当图片下载失败时，脚本能记录错误并尝试重试

### 5.8 修改GitHub Actions工作流

修改`.github/workflows/deploy-to-domestic.yml`文件，在构建静态文件后、部署到服务器前添加图片本地化步骤：

```yaml
# 构建静态文件
- name: Build static files
  run: npm run export
  env:
    EXPORT: true
    NOTION_PAGE_ID: ${{ secrets.NOTION_PAGE_ID }}
    NEXT_PUBLIC_THEME: ${{ secrets.NEXT_PUBLIC_THEME || 'simpleFeittt' }}
    NEXT_PUBLIC_LANG: ${{ secrets.NEXT_PUBLIC_LANG || 'zh-CN' }}

# 新增：图片本地化处理
- name: Localize Notion images
  run: node scripts/localize-images.js
  
# 确保目标目录存在
- name: Create target directory on remote server
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.REMOTE_HOST }}
    username: ${{ secrets.REMOTE_USER }}
    key: ${{ secrets.REMOTE_SSH_KEY }}
    script: |
      /bin/mkdir -p ${{ secrets.REMOTE_TARGET_DIR }}
```

**可测试标准**：GitHub Actions工作流能成功执行图片本地化步骤

## 6. 验收标准

### 6.1 功能验收

1. 阿里云部署的网站中，所有Notion图片都使用本地路径
2. 图片加载速度明显提升（目标：平均加载时间减少50%以上）
3. 图片显示质量与原Notion图片一致
4. Vercel部署的网站继续使用原始Notion图片链接

### 6.2 技术验收

1. 图片本地化脚本运行稳定，无未处理的异常
2. 增量处理功能正常工作，避免重复下载
3. GitHub Actions工作流执行成功，无错误
4. 部署时间增加不超过5分钟

### 6.3 性能验收

1. 100张图片的处理时间不超过2分钟
2. 1000张图片的处理时间不超过10分钟
3. 内存使用峰值不超过1GB

## 7. 风险与缓解措施

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Notion图片URL格式变化 | 无法提取或下载图片 | 实现灵活的URL匹配模式，定期检查和更新 |
| 图片数量过多导致部署时间过长 | 延迟部署，增加CI/CD成本 | 实现增量处理和并发下载，设置超时机制 |
| 图片下载失败 | 部分图片无法本地化 | 实现重试机制，记录失败图片，允许部分失败不影响整体部署 |
| 存储空间不足 | 部署失败 | 监控存储使用情况，实现图片压缩，定期清理不再使用的图片 |

## 8. 未来扩展

1. **图片压缩**：添加图片压缩功能，减小存储和传输开销
2. **图片格式转换**：将图片转换为更高效的格式（如WebP）
3. **CDN集成**：支持将图片上传到阿里云OSS，使用CDN加速
4. **媒体资源扩展**：扩展支持视频、音频等其他媒体资源的本地化
5. **自动清理**：实现自动清理不再使用的本地图片

## 9. 附录

### 9.1 技术栈

- Node.js
- axios（HTTP请求）
- cheerio（HTML解析）
- fs-extra（文件操作）
- crypto（哈希计算）
- p-limit（并发控制）
- commander（命令行参数解析）
- winston（日志记录）

### 9.2 参考资料

- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Notion API Documentation](https://developers.notion.com/)