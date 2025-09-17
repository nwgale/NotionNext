const BLOG = require('./blog.config')
const fs = require('fs')
const path = require('path')

/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // additionalPaths 函数现在极其简单和稳定
  additionalPaths: async (config) => {
    const tempFilePath = path.join(__dirname, '.sitemap-paths.json');
    let additionalPaths = [];

    try {
      // 检查临时文件是否存在
      if (fs.existsSync(tempFilePath)) {
        const fileContent = fs.readFileSync(tempFilePath, 'utf8');
        const paths = JSON.parse(fileContent);
        const dateNow = new Date().toISOString();

        // 将路径数组格式化为 sitemap 条目
        additionalPaths = paths.map(p => ({
          loc: `${BLOG.LINK}${p.trim()}`,
          lastmod: dateNow,
          changefreq: 'daily',
          priority: '0.7'
        }));
      }
    } catch (error) {
      console.error('Error reading or parsing .sitemap-paths.json', error);
    }

    return additionalPaths;
  }
}
