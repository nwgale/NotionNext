# 如何为NotionNext网站的sitemap添加额外目录？

## 1. 问题的提出

在我们的 NotionNext 网站 (`https://tianfei.chat`) 之外，我们通过 Nginx 的 `alias` 指令配置了一个独立的静态内容目录 `/app/`。这个目录下的页面（例如 `/app/yuliu/`）完全独立于 NotionNext 的构建体系，因此它们不会被自动包含在由项目动态生成的 `sitemap.xml` 文件中。

这会导致搜索引擎无法有效发现这些独立的App页面，对SEO非常不利。我们的核心目标是：**找到一种自动化、易于维护的方式，将这些外部页面的链接注入到Sitemap中。**

## 2. 方案的演进与决策

我们探讨了多种解决方案，并最终选择了最优雅、最符合项目理念的一种。

*   **方案A：手动修改代码（被否决）**
    *   **做法**：每次新增App页面时，都去修改 `pages/sitemap.xml.js` 文件，将新路径硬编码进去。
    *   **缺点**：非常繁琐，容易出错，不符合自动化原则。

*   **方案B：使用项目内的JSON文件（被否决）**
    *   **做法**：在项目中创建一个 `app-list.json` 文件来维护路径列表，然后让 `sitemap.xml.js` 读取这个JSON。
    *   **缺点**：虽然实现了数据与逻辑分离，但每次更新仍需修改代码库并提交，不够便捷。

*   **方案C：以Notion为配置中心（最终选定）**
    *   **做法**：利用NotionNext项目“以Notion为中心”的设计思想，将App页面列表作为一个配置项，直接在Notion的配置数据库中进行管理。
    *   **优点**：
        *   **极致便捷**：未来增删页面，只需在Notion中修改一行文字，无需接触任何代码。
        *   **配置统一**：与网站的其他配置（如标题、作者等）管理方式完全一致。
        *   **安全可靠**：将维护工作从“修改代码”降级为“修改数据”，大大降低了风险。

## 3. 最终实现步骤

我们通过“分工协作”的方式，完美实现了方案C。

### 步骤1：在Notion中添加配置

在Notion的配置中心数据库中，我们新增了一行配置，用于专门存放自定义的Sitemap条目。

*   **key** (配置名): `APP_LIST_FOR_SITEMAP`
*   **value** (配置值):
    ```
    /app/yuliu/
    /app/app2/
    ```
    *(**重要**：我们约定使用**换行（回车）**作为路径之间的分隔符，这样在Notion中既清晰又易于维护。)*
*   **description** (描述): `用于Sitemap的自定义App页面列表`

### 步骤2：修改Sitemap生成脚本

我们修改了 `pages/sitemap.xml.js` 文件，在其中加入了读取和处理上述Notion配置的逻辑。

核心代码片段如下：

```javascript
// pages/sitemap.xml.js

// ... (原有代码)

    // 从Notion配置中读取并添加自定义App页面
    const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG)
    if (appListString) {
      // 1. 以换行符分割字符串，并过滤掉空行
      const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '')
      const dateNow = new Date().toISOString().split('T')[0]
      // 2. 为每个路径生成一个sitemap条目
      const appFields = appPaths.map(path => {
        return {
          loc: `${link}${path.trim()}`, // 拼接成完整URL
          lastmod: dateNow,
          changefreq: 'daily',
          priority: '0.7'
        }
      })
      // 3. 将自定义页面与博客文章页面合并
      fields = fields.concat(appFields)
    }

// ... (原有代码)
```

这段代码的逻辑非常清晰和健壮：它会获取`APP_LIST_FOR_SITEMAP`的值，用换行符分割，然后为每个有效的路径生成一个标准的Sitemap条目，并最终添加到总的列表中。

## 4. 总结

通过将自定义页面列表的管理权限交还给Notion，我们实现了一个一劳永逸的自动化解决方案。未来，网站的Sitemap维护工作将变得像写一篇博客文章一样简单，只需在Notion中增删几行文字，然后重新部署即可。这完美体现了NotionNext项目的核心优势。