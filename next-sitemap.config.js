const BLOG = require('./blog.config')
const fs = require('fs')
const path = require('path')

const getLastmodMap = () => {
  try {
    // Read from the persistent cache directory
    const cacheDir = path.resolve('.next', 'cache')
    const filePath = path.join(cacheDir, 'lastmod-map.json')
    if (fs.existsSync(filePath)) {
      console.log(`[Sitemap] Reading lastmod-map.json from ${filePath}`)
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    } else {
      console.log(`[Sitemap] Cache file not found at ${filePath}. Defaulting to build time.`)
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to read or parse lastmod-map.json.', e)
  }
  return {}
}

const lastmodMap = getLastmodMap()

/**
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,

  // The transform function allows us to customize the sitemap entries.
  // We use it here to inject the precise `lastmod` time for each post.
  transform: async (config, path) => {
    // Use the path directly as the key, as it matches the `href` property used to build the map.
    const lastmodTimestamp = lastmodMap[path]

    const lastmod = lastmodTimestamp ? new Date(lastmodTimestamp).toISOString() : new Date().toISOString()

    return {
      loc: path, // => this will be exported as http://<link>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod,
      alternateRefs: config.alternateRefs ?? []
    }
  }
}