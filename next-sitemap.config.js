const BLOG = require('./blog.config')

/**
 * @type {import('next-sitemap').IConfig}
 * 这个配置文件用于 next-sitemap 命令，在 next export 静态导出时生成 sitemap.xml
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // 这个函数在构建时执行，用于获取额外的 sitemap 路径
  additionalPaths: async (config) => {
    // 在CJS模块中使用动态import()来加载ESM模块
    const { getGlobalData } = await import('./lib/db/getSiteData.js')
    const { siteConfig } = await import('./lib/config.js')
    const { extractLangId } = await import('./lib/utils/pageId.js')

    // 从Notion获取数据
    const siteId = BLOG.NOTION_PAGE_ID.split(',')[0]
    const id = extractLangId(siteId)
    const siteData = await getGlobalData({ pageId: id, from: 'next-sitemap-config' })
    const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG)

    if (!appListString) {
      return []
    }

    // 解析字符串并创建 sitemap 条目
    const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '')
    const dateNow = new Date().toISOString()

    const fields = appPaths.map(path => {
      return {
        loc: `${BLOG.LINK}${path.trim()}`,
        lastmod: dateNow,
        changefreq: 'daily',
        priority: '0.7'
      }
    })

    return fields
  }
}
