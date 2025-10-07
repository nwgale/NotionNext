const BLOG = require('./blog.config')

/**
 * 通常没啥用，sitemap交给 /pages/sitemap.xml.js 动态生成
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options

  // 添加额外路径
  additionalPaths: async (config) => {
    const additional = [
      await config.transform(config, '/test-1'),
      await config.transform(config, '/test-2')
    ]
    console.log('[PM-CHECK-SITEMAP] Preparing to add additional paths:', JSON.stringify(additional, null, 2))
    return additional
  },
}
