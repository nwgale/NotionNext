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

  // additionalPaths a function to generate paths on the fly.
  //   additionalPaths: async (config) => {
  //   //   // Add logic here to fetch paths from other sources.
  //   //   const paths = await fetch('https://.../posts')
  //   //   return paths.map((post) => ({
  //   //     loc: `/posts/${post.slug}`,
  //   //     lastmod: post.updatedAt,
  //   //   }))
  //   // },
}
