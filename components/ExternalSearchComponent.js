import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 外部搜索组件
 * 使用第三方搜索引擎（如Bing、百度等）搜索网站内容
 */
const ExternalSearchComponent = ({ cRef, className, searchEngine = 'bing' }) => {
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  const [showClean, setShowClean] = useState(false)
  let lock = false

  // 暴露focus方法给父组件
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  // 获取网站域名，用于构建搜索查询
  const siteDomain = siteConfig('CANONICAL_DOMAIN') || 'https://tianfei.chat'
  const domainWithoutProtocol = siteDomain.replace(/^https?:\/\//, '')

  // 根据选择的搜索引擎构建搜索URL
  const getSearchUrl = (keyword) => {
    const encodedKeyword = encodeURIComponent(keyword)
    const encodedSite = encodeURIComponent(`site:${domainWithoutProtocol}`)
    
    switch (searchEngine.toLowerCase()) {
      case 'google':
        return `https://www.google.com/search?q=${encodedKeyword}+${encodedSite}`
      case 'baidu':
        return `https://www.baidu.com/s?wd=${encodedKeyword}+${encodedSite}`
      case 'sogou':
        return `https://www.sogou.com/web?query=${encodedKeyword}+${encodedSite}`
      case '360':
        return `https://www.so.com/s?q=${encodedKeyword}+${encodedSite}`
      default: // 默认使用Bing
        return `https://www.bing.com/search?q=${encodedKeyword}+${encodedSite}`
    }
  }

  // 处理搜索
  const handleSearch = () => {
    const keyword = searchInputRef.current.value.trim()

    if (keyword && keyword !== '') {
      setLoadingState(true)
      // 在新窗口中打开搜索结果
      window.open(getSearchUrl(keyword), '_blank')
      setLoadingState(false)
    }
  }

  // 处理键盘事件
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) { // 回车
      handleSearch()
    } else if (e.keyCode === 27) { // ESC
      cleanSearch()
    }
  }

  // 清空搜索框
  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }

  // 更新搜索关键词
  const updateSearchKey = (val) => {
    if (lock) {
      return
    }

    if (val) {
      setShowClean(true)
    } else {
      setShowClean(false)
    }
  }

  // 处理中文输入法
  function lockSearchInput() {
    lock = true
  }

  function unLockSearchInput() {
    lock = false
  }

  return (
    <div className={'flex w-full bg-gray-100 ' + className}>
      <input
        ref={searchInputRef}
        type='text'
        placeholder='站内搜索'
        className={'outline-none w-full text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-900 dark:text-white'}
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        onChange={e => updateSearchKey(e.target.value)}
      />

      <div className='-ml-8 cursor-pointer float-right items-center justify-center py-2'
        onClick={handleSearch}>
        <i className={`hover:text-black transform duration-200 text-gray-500 dark:hover:text-gray-300 cursor-pointer fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'}`} />
      </div>

      {(showClean &&
        <div className='-ml-12 cursor-pointer float-right items-center justify-center py-2'>
          <i className='fas fa-times hover:text-black transform duration-200 text-gray-400 cursor-pointer dark:hover:text-gray-300' onClick={cleanSearch} />
        </div>
      )}
    </div>
  )
}

export default ExternalSearchComponent