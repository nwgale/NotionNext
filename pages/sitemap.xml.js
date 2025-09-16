// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async ctx => {
  let fields = []
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    // 第一个id站点默认语言
    const siteData = await getGlobalData({
      pageId: id,
      from: 'sitemap.xml'
    })
    const link = siteConfig(
      'LINK',
      siteData?.siteInfo?.link,
      siteData.NOTION_CONFIG
    )
    const localeFields = generateLocalesSitemap(link, siteData.allPages, locale)
    fields = fields.concat(localeFields)

    // 将网站的额外子目录/app/增加到sitemap，这些目录数据由作者自行添加到Notion配置中心APP_LIST_FOR_SITEMAP字段
    const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG)
    if (!appListString) {
      throw new Error('[Debug Sitemap] FAILED: The value for APP_LIST_FOR_SITEMAP from Notion is empty or not found!')
    }
    console.error('[Debug Sitemap] SUCCESS: APP_LIST_FOR_SITEMAP from Notion:', appListString)
    if (appListString) {
      const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '')
      const dateNow = new Date().toISOString().split('T')[0]
      const appFields = appPaths.map(path => {
        return {
          loc: `${link}${path.trim()}`,
          lastmod: dateNow,
          changefreq: 'daily',
          priority: '0.7'
        }
      })
      fields = fields.concat(appFields)
    }
  }

  fields = getUniqueFields(fields)

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap(link, allPages, locale) {
  // 确保链接不以斜杠结尾
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }

  if (locale && locale.length > 0 && locale.indexOf('/') !== 0) {
    locale = '/' + locale
  }
  const dateNow = new Date().toISOString().split('T')[0]
  const defaultFields = [
    {
      loc: `${link}${locale}`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/archive`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/category`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/rss/feed.xml`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/search`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${link}${locale}/tag`,
      lastmod: dateNow,
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields =
    allPages
      ?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
      ?.map(post => {
        const slugWithoutLeadingSlash = post?.slug.startsWith('/')
          ? post?.slug?.slice(1)
          : post.slug
        return {
          loc: `${link}${locale}/${slugWithoutLeadingSlash}`,
          lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
          changefreq: 'daily',
          priority: '0.7'
        }
      }) ?? []

  return defaultFields.concat(postFields)
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map();

  fields.forEach(field => {
    const existingField = uniqueFieldsMap.get(field.loc);

    if (!existingField || new Date(field.lastmod) > new Date(existingField.lastmod)) {
      uniqueFieldsMap.set(field.loc, field);
    }
  });

  return Array.from(uniqueFieldsMap.values());
}

export default () => {}
