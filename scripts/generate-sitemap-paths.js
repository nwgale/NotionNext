// scripts/generate-sitemap-paths.js
// 职责：在构建前运行，从Notion获取自定义路径，并写入一个临时的JSON文件。

const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, '..', '.sitemap-paths.json');

async function generatePaths() {
  console.log('[Sitemap Generator]: Starting to fetch custom paths from Notion...');

  try {
    // 使用简化的方式，直接从 Notion 配置中心获取数据
    const BLOG = require('../blog.config.js');
    
    // 使用 notion-client 直接获取配置数据
    const { NotionAPI } = require('notion-client');
    const notion = new NotionAPI();
    
    // 获取配置页面
    const pageId = BLOG.NOTION_PAGE_ID.split(',')[0];
    console.log('[Sitemap Generator]: Fetching page:', pageId);
    
    const recordMap = await notion.getPage(pageId);
    
    // 从页面属性中查找 APP_LIST_FOR_SITEMAP 字段
    let appListString = '';
    
    // 查找数据库中的配置项
    if (recordMap.collection) {
      for (const [collectionId, collectionData] of Object.entries(recordMap.collection)) {
        const collection = collectionData.value;
        if (collection && collection.schema) {
          // 查找 APP_LIST_FOR_SITEMAP 字段
          let targetSchemaKey = null;
          for (const [schemaKey, schemaValue] of Object.entries(collection.schema)) {
            if (schemaValue.name === 'APP_LIST_FOR_SITEMAP') {
              targetSchemaKey = schemaKey;
              console.log('[Sitemap Generator]: Found APP_LIST_FOR_SITEMAP field in schema');
              break;
            }
          }
          
          if (targetSchemaKey) {
            // 查找对应的数据行
            for (const [blockId, blockValue] of Object.entries(recordMap.block)) {
              if (blockValue.value && 
                  blockValue.value.type === 'page' && 
                  blockValue.value.parent_id === collectionId &&
                  blockValue.value.properties && 
                  blockValue.value.properties[targetSchemaKey]) {
                
                const propertyValue = blockValue.value.properties[targetSchemaKey];
                if (propertyValue && propertyValue[0] && propertyValue[0][0]) {
                  appListString = propertyValue[0][0];
                  console.log('[Sitemap Generator]: Found APP_LIST_FOR_SITEMAP value:', appListString);
                  break;
                }
              }
            }
          }
        }
      }
    }
    
    // 如果没有找到或为空，写入空数组
    if (!appListString) {
      console.log('[Sitemap Generator]: APP_LIST_FOR_SITEMAP is empty or not found. Writing empty array.');
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