import BLOG from '@/blog.config'
import {
  getDataFromCache,
  setDataToCache
} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'
import notionAPI from '@/lib/notion/getNotionAPI'

/**
 * Normalize Notion recordMap entries.
 * Some responses wrap data as { value: { value: {...}, role: 'reader' } }.
 * The project expects { value: {...}, role: 'reader' }.
 */
function normalizeRecordMap(recordMap) {
  if (!recordMap || typeof recordMap !== 'object') {
    return recordMap
  }

  const tables = [
    'block',
    'collection',
    'collection_view',
    'notion_user',
    'space'
  ]

  tables.forEach(table => {
    const map = recordMap?.[table]
    if (!map || typeof map !== 'object') {
      return
    }
    Object.keys(map).forEach(key => {
      const entry = map[key]
      if (
        entry?.value &&
        typeof entry.value === 'object' &&
        entry.value?.value &&
        typeof entry.value.value === 'object' &&
        entry.value?.role
      ) {
        map[key] = {
          ...entry,
          role: entry.value.role,
          value: entry.value.value
        }
      }
    })
  })

  return recordMap
}

/**
 * 获取文章内容块
 * @param {*} id
 * @param {*} from
 * @param {*} slice
 * @returns
 */
export async function getPage(id, from = null, slice) {
  const cacheKey = `page_content_${id}`
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    // 兼容旧缓存中未归一化的 recordMap 结构
    pageBlock = normalizeRecordMap(pageBlock)
    return convertNotionBlocksToPost(id, pageBlock, slice)
  }

  // 抓取最新数据
  pageBlock = await getPageWithRetry(id, from)

  if (pageBlock) {
    pageBlock = normalizeRecordMap(pageBlock)
    await setDataToCache(cacheKey, pageBlock)
    return convertNotionBlocksToPost(id, pageBlock, slice)
  }
  return pageBlock
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, from, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      '[API-->>请求]',
      `from:${from}`,
      `id:${id}`,
      retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : ''
    )
    try {
      const start = new Date().getTime()
      const pageData = await notionAPI.getPage(id)
      const end = new Date().getTime()
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
      return normalizeRecordMap(pageData)
    } catch (e) {
      console.warn('[API<<--异常]:', e)
      await delay(1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.log('[重试缓存]', `from:${from}`, `id:${id}`)
        return normalizeRecordMap(pageBlock)
      }
      return await getPageWithRetry(id, from, retryAttempts - 1)
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function convertNotionBlocksToPost(id, blockMap, slice) {
  const clonePageBlock = deepClone(blockMap)
  normalizeRecordMap(clonePageBlock)
  let count = 0
  const blocksToProcess = Object.keys(clonePageBlock?.block || {})

  // 循环遍历文档的每个block
  for (let i = 0; i < blocksToProcess.length; i++) {
    const blockId = blocksToProcess[i]
    const b = clonePageBlock?.block[blockId]

    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[blockId]
      continue
    }

    // 当BlockId等于PageId时移除
    if (b?.value?.id === id) {
      // 此block含有敏感信息
      delete b?.value?.properties
      continue
    }

    count++

    if (b?.value?.type === 'sync_block' && b?.value?.children) {
      const childBlocks = b.value.children
      // 移除同步块
      delete clonePageBlock.block[blockId]
      // 用子块替代同步块
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = `${blockId}_child_${index}`
        clonePageBlock.block[newBlockId] = childBlock
        blocksToProcess.splice(i + index + 1, 0, newBlockId)
      })
      // 重新处理新加入的子块
      i--
      continue
    }

    // 处理 c++、c#、汇编等语言名字映射
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    // 如果是文件，或嵌入式PDF，需要重新加密签名
    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0].indexOf('attachment') === 0 ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }
  }

  // 去掉不用的字段
  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock
  }
  return clonePageBlock
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 40) => {
  // 如果 ids 不是数组，则将其转换为数组
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  const normalizedIds = [...new Set(ids.filter(Boolean))]
  const effectiveBatchSize = Math.max(1, Math.min(batchSize, 40))
  const unresolvedIds = new Set(normalizedIds)

  let fetchedBlocks = {}
  for (let i = 0; i < normalizedIds.length; i += effectiveBatchSize) {
    const batch = normalizedIds.slice(i, i + effectiveBatchSize)
    let pageChunk = null

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log('[API-->>请求] Fetching missing blocks', batch, normalizedIds.length)
        const start = new Date().getTime()
        pageChunk = await notionAPI.getBlocks(batch)
        normalizeRecordMap(pageChunk?.recordMap)
        const end = new Date().getTime()
        console.log(
          `[API<<--响应] 耗时:${end - start}ms Fetching missing blocks count:${normalizedIds.length} `
        )
        break
      } catch (error) {
        console.warn('[API<<--异常] Fetching missing blocks failed', {
          attempt,
          batchStart: i,
          batchSize: batch.length,
          message: error?.message
        })
        if (attempt < 3) {
          await delay(1000 * attempt)
        }
      }
    }

    const batchBlocks = pageChunk?.recordMap?.block || {}
    fetchedBlocks = Object.assign({}, fetchedBlocks, batchBlocks)
    batch.forEach(id => {
      if (batchBlocks[id]?.value) {
        unresolvedIds.delete(id)
      }
    })

    const missingInBatch = batch.filter(id => !batchBlocks[id]?.value)
    if (missingInBatch.length > 0) {
      console.warn('[API] Missing blocks after batch fetch, fallback to single fetch', {
        missingCount: missingInBatch.length,
        batchStart: i
      })
      for (const id of missingInBatch) {
        const singlePageMap = await getPageWithRetry(
          id,
          `fetch-missing-block-${id}`,
          2
        )
        const recoveredBlock = singlePageMap?.block?.[id]
        if (recoveredBlock?.value) {
          fetchedBlocks[id] = recoveredBlock
          unresolvedIds.delete(id)
        }
        await delay(120)
      }
    }
  }

  if (unresolvedIds.size > 0) {
    const preview = [...unresolvedIds].slice(0, 10)
    console.warn('[API] Some blocks are still missing after fallback recovery', {
      missingCount: unresolvedIds.size,
      sampleIds: preview
    })
  }

  return fetchedBlocks
}
