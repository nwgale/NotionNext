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
    try {
      console.error('[Sitemap Debug] 1/8: Starting additionalPaths function.')

      // 在CJS模块中使用动态import()来加载ESM模块
      const { getGlobalData } = await import('./lib/db/getSiteData.js')
      console.error('[Sitemap Debug] 2/8: Imported getGlobalData.')

      const { siteConfig } = await import('./lib/config.js')
      console.error('[Sitemap Debug] 3/8: Imported siteConfig.')

      const { extractLangId } = await import('./lib/utils/pageId.js')
      console.error('[Sitemap Debug] 4/8: Imported extractLangId.')

      // 从Notion获取数据
      const siteId = BLOG.NOTION_PAGE_ID.split(',')[0]
      const id = extractLangId(siteId)
      console.error(`[Sitemap Debug] 5/8: Fetching data for siteId: ${id}`)

      const siteData = await getGlobalData({ pageId: id, from: 'next-sitemap-config' })
      console.error('[Sitemap Debug] 6/8: Fetched siteData from Notion.')

      const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG)
      console.error(`[Sitemap Debug] 7/8: Raw appListString from Notion: "${appListString}"`)

      if (!appListString) {
        console.error('[Sitemap Debug] appListString is empty. Returning empty array.')
        return []
      }

      // 解析字符串并创建 sitemap 条目
      const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '')
      const dateNow = new Date().toISOString()
      const fields = appPaths.map(path => ({
        loc: `${BLOG.LINK}${path.trim()}`,
        lastmod: dateNow,
        changefreq: 'daily',
        priority: '0.7'
      }))

      console.error('[Sitemap Debug] 8/8: Successfully generated fields:', fields)
      return fields
    } catch (e) {
      console.error('[Sitemap Debug] CRITICAL ERROR in additionalPaths:', e)
      // 返回空数组以防构建中断
      return []
    }
  }
}
