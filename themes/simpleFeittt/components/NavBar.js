import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'
import ExternalSearchComponent from '@/components/ExternalSearchComponent'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export default function NavBar(props) {
  const [showSearchInput, changeShowSearchInput] = useState(false)
  const [showExternalSearch, setShowExternalSearch] = useState(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()
  const externalSearchRef = useRef(null)

  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else if (siteConfig('ENABLE_EXTERNAL_SEARCH') === 'true') {
      // 使用外部搜索
      setShowExternalSearch(!showExternalSearch)
      changeShowSearchInput(false)
      if (!showExternalSearch) {
        setTimeout(() => {
          externalSearchRef.current?.focus()
        }, 100)
      }
    } else {
      // 使用原生搜索
      changeShowSearchInput(!showSearchInput)
      setShowExternalSearch(false)
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('simple-search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <nav className='w-full bg-white md:pt-0  relative z-20 shadow border-t border-gray-100 dark:border-hexo-black-gray dark:bg-black'>
      <div
        id='nav-bar-inner'
        className='h-12 container mx-auto max-w-6xl justify-between items-center text-sm md:text-md md:justify-start'>
        {/* 左侧菜单 */}
        <div className='h-full w-full float-left text-center md:text-left flex flex-wrap items-stretch md:justify-start md:items-start space-x-4'>
          {showSearchInput && (
            <input
              autoFocus
              id='simple-search'
              onKeyUp={onKeyUp}
              className='float-left w-full outline-none h-full px-4'
              aria-label='Submit search'
              type='search'
              name='s'
              autoComplete='off'
              placeholder='Type then hit enter to search...'
            />
          )}
          {showExternalSearch && (
            <div className='float-left w-full h-full'>
              <ExternalSearchComponent 
                cRef={externalSearchRef}
                className='h-full'
                searchEngine={siteConfig('EXTERNAL_SEARCH_ENGINE') || 'bing'}
              />
            </div>
          )}
          {!showSearchInput && !showExternalSearch && <MenuList {...props} />}
        </div>

        <div className='absolute right-12 h-full text-center px-2 flex items-center text-blue-400  cursor-pointer'>
          {/* <!-- extra links --> */}
          <i
            className={
              showSearchInput
                ? 'fa-regular fa-circle-xmark'
                : 'fa-solid fa-magnifying-glass' + ' align-middle'
            }
            onClick={toggleShowSearchInput}></i>
        </div>
      </div>
    </nav>
  )
}
