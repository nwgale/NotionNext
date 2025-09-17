// scripts/generate-sitemap-paths.js
// 职责：在构建前运行，从Notion获取自定义路径，并写入一个临时的JSON文件。

// 注册模块别名，允许此脚本使用 '@/' 路径
try {
  require('module-alias/register');
} catch (e) {
  // 在某些环境下，如果直接从根目录运行，可能已注册
}

const fs = require('fs');
const path = require('path');
const { getGlobalData } = require('@/lib/db/getSiteData');
const { siteConfig } = require('@/lib/config');
const BLOG = require('@/blog.config');

const outputFile = path.join(__dirname, '..', '.sitemap-paths.json');

async function generatePaths() {
  console.log('[Sitemap Generator]: Starting to fetch custom paths from Notion...');

  try {
    const siteData = await getGlobalData({ pageId: BLOG.NOTION_PAGE_ID });
    const appListString = siteConfig('APP_LIST_FOR_SITEMAP', '', siteData.NOTION_CONFIG);

    if (!appListString) {
      console.log('[Sitemap Generator]: APP_LIST_FOR_SITEMAP is empty in Notion. Writing empty array.');
      fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
      return;
    }

    const appPaths = appListString.split('\n').filter(p => p && p.trim() !== '');
    console.log(`[Sitemap Generator]: Found ${appPaths.length} custom paths.`);

    fs.writeFileSync(outputFile, JSON.stringify(appPaths, null, 2));
    console.log(`[Sitemap Generator]: Successfully wrote paths to ${outputFile}`);

  } catch (error) {
    console.error('[Sitemap Generator]: An error occurred:', error);
    // 如果发生错误，写入一个空数组以防主构建流程中断
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    console.log('[Sitemap Generator]: Wrote empty array to fallback file due to error.');
  }
}

generatePaths();