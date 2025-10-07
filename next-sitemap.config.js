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

  // 添加额外路径 (终极简化测试)
  additionalPaths: async (config) => {
    console.log('[PM-CHECK-SITEMAP] Returning a simple array of strings from the function.');
    return [
      '/test-1',
      '/test-2',
    ];
  },
}
