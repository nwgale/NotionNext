import BLOG from '@/blog.config'
import notionAPI from '@/lib/notion/getNotionAPI'

function collectIdsFromReducerResults(result) {
  const pageSet = new Set()
  if (!result) {
    return pageSet
  }

  if (Array.isArray(result?.blockIds)) {
    result.blockIds.forEach(id => pageSet.add(id))
  }

  const reducerResults = result?.reducerResults || {}
  Object.values(reducerResults).forEach(reducerItem => {
    reducerItem?.blockIds?.forEach(id => pageSet.add(id))
  })

  return pageSet
}

async function getPageIdsByQueryCollection({
  collectionId,
  collectionView,
  viewIds,
  from
}) {
  if (!collectionId || !collectionView) {
    return []
  }

  const candidateViewIds =
    Array.isArray(viewIds) && viewIds.length > 0
      ? viewIds
      : Object.keys(collectionView || {})

  if (candidateViewIds.length === 0) {
    return []
  }

  const pageSet = new Set()
  for (const viewId of candidateViewIds) {
    const view = collectionView?.[viewId]?.value || collectionView?.[viewId]
    if (!view) {
      continue
    }

    try {
      const queryResult = await notionAPI.getCollectionData(
        collectionId,
        viewId,
        view,
        { limit: 999 }
      )
      const idsFromQuery = collectIdsFromReducerResults(queryResult?.result)
      idsFromQuery.forEach(id => pageSet.add(id))
    } catch (error) {
      console.warn('[Notion pageIds] queryCollection fallback failed', {
        from,
        collectionId,
        viewId,
        message: error?.message
      })
    }
  }

  return [...pageSet]
}

export default async function getAllPageIds(
  collectionQuery,
  collectionId,
  collectionView,
  viewIds,
  debugContext = {}
) {
  const from = debugContext?.from || 'unknown'
  if (!collectionQuery && !collectionView) {
    console.warn('[Notion pageIds] Both collectionQuery and collectionView are empty', {
      from,
      collectionId
    })
    return []
  }
  let pageIds = []
  const collectionQueryById = collectionQuery?.[collectionId]
  try {
    // Notion数据库中的第几个视图用于站点展示和排序：
    const groupIndex = BLOG.NOTION_INDEX || 0
    if (viewIds && viewIds.length > 0) {
      const targetViewId = viewIds[groupIndex]
      if (!collectionQueryById) {
        console.warn('[Notion pageIds] collectionQuery missing target collection', {
          from,
          collectionId,
          targetViewId,
          viewIdsCount: viewIds.length,
          collectionQueryTopKeys: Object.keys(collectionQuery || {}).length
        })
      }
      const ids = collectionQueryById?.[targetViewId]?.collection_group_results?.blockIds || []
      for (const id of ids) {
        pageIds.push(id)
      }
    }
  } catch (error) {
    console.error('[Notion pageIds] Error fetching page IDs', {
      from,
      collectionId,
      viewIdsCount: Array.isArray(viewIds) ? viewIds.length : 0,
      collectionQueryTopKeys: Object.keys(collectionQuery || {}).length,
      hasCollectionEntry: Boolean(collectionQuery?.[collectionId]),
      message: error?.message
    })
    return []
  }

  // 否则按照数据库原始排序
  if (
    pageIds.length === 0 &&
    collectionQuery &&
    Object.values(collectionQuery).length > 0
  ) {
    console.warn('[Notion pageIds] Primary view query returned 0 ids, fallback to iterate all views', {
      from,
      collectionId,
      viewIdsCount: Array.isArray(viewIds) ? viewIds.length : 0,
      collectionQueryTopKeys: Object.keys(collectionQuery || {}).length,
      hasCollectionEntry: Boolean(collectionQueryById)
    })
    const pageSet = new Set()
    const fallbackViews = collectionQueryById
      ? Object.values(collectionQueryById)
      : Object.values(collectionQuery).flatMap(queryByCollectionId =>
          Object.values(queryByCollectionId || {})
        )

    fallbackViews.forEach(view => {
      view?.blockIds?.forEach(id => pageSet.add(id)) // group视图
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id)) // table视图
    })
    pageIds = [...pageSet]
    if (pageIds.length > 0) {
      console.warn('[Notion pageIds] Fallback recovered pageIds', {
        from,
        collectionId,
        recoveredCount: pageIds.length,
        fromAllCollections: !collectionQueryById
      })
    }
  }

  // 当 collection_query 为空或不完整时，主动调用 queryCollection 拉取完整 blockIds
  if (pageIds.length === 0) {
    const queryCollectionPageIds = await getPageIdsByQueryCollection({
      collectionId,
      collectionView,
      viewIds,
      from
    })
    if (queryCollectionPageIds.length > 0) {
      pageIds = queryCollectionPageIds
      console.warn(
        '[Notion pageIds] Recovered pageIds from queryCollection fallback',
        {
          from,
          collectionId,
          recoveredCount: pageIds.length,
          viewCandidates:
            Array.isArray(viewIds) && viewIds.length > 0
              ? viewIds.length
              : Object.keys(collectionView || {}).length
        }
      )
    }
  }

  // 当 Notion 接口未返回 collection_query 时，尝试从 collection_view 的 page_sort 恢复
  if (
    pageIds.length === 0 &&
    collectionView &&
    Object.values(collectionView).length > 0
  ) {
    const pageSet = new Set()
    const viewCandidates = Array.isArray(viewIds) && viewIds.length > 0
      ? viewIds.map(id => collectionView?.[id]).filter(Boolean)
      : Object.values(collectionView)

    viewCandidates.forEach(view => {
      const viewValue = view?.value || view
      viewValue?.page_sort?.forEach(id => pageSet.add(id))
    })

    if (pageSet.size > 0) {
      pageIds = [...pageSet]
      console.warn('[Notion pageIds] Recovered pageIds from collection_view.page_sort', {
        from,
        collectionId,
        recoveredCount: pageIds.length,
        viewCandidates: viewCandidates.length
      })
    }
  }
  if (pageIds.length === 0) {
    console.error('[Notion pageIds] Final pageIds is empty', {
      from,
      collectionId,
      viewIdsCount: Array.isArray(viewIds) ? viewIds.length : 0,
      collectionQueryTopKeys: Object.keys(collectionQuery || {}).length,
      hasCollectionEntry: Boolean(collectionQuery?.[collectionId])
    })
  }
  return pageIds
}
