const BLOG = require('./blog.config')
const fs = require('fs')
const path = require('path')

/**
 * Reads the lastmod map generated during the build process.
 * This map contains the precise last modification time for each internal post.
 * @returns {Object} A map of page paths to their lastmod ISO strings.
 */
const getLastmodMap = () => {
  try {
    const os = require('os')
    const filePath = path.join(os.tmpdir(), 'notion-next-lastmod-map.json')
    if (fs.existsSync(filePath)) {
      console.log('[Sitemap] Found lastmod-map.json from temp directory.')
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch (e) {
    console.warn('[Sitemap] Failed to read lastmod-map.json, will use default dates.', e)
  }
  console.log('[Sitemap] lastmod-map.json not found in temp directory, using default dates.')
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
    // Remove leading slash, e.g., '/post-slug' -> 'post-slug'
    const key = path.slice(1)
    const lastmodTimestamp = lastmodMap[key]
    // Use the lastmod from the map if it exists, otherwise fall back to the current date.
    const lastmod = lastmodTimestamp
      ? new Date(lastmodTimestamp).toISOString()
      : new Date().toISOString()

    return {
      loc: path, // => this will be exported as http://<link>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod, // Use the precise lastmod.
      alternateRefs: config.alternateRefs ?? []
    }
  }
}