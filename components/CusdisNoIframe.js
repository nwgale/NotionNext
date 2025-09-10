import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 无iframe版本的Cusdis评论组件
 * 基于Cusdis v1.1.x的实现方式，直接将评论组件附加到DOM元素上
 */
const CusdisNoIframe = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const commentRef = useRef(null)
  const scriptLoaded = useRef(false)
  
  // 获取配置
  const host = siteConfig('COMMENT_CUSDIS_HOST')
  const appId = siteConfig('COMMENT_CUSDIS_APP_ID')
  const pageId = frontMatter.id
  const pageUrl = siteConfig('LINK') + router.asPath
  const pageTitle = frontMatter.title
  const theme = isDarkMode ? 'dark' : 'light'
  const i18nForCusdis = siteConfig('LANG').toLowerCase().indexOf('zh') === 0 ? siteConfig('LANG').toLowerCase() : siteConfig('LANG').toLowerCase().substring(0, 2)
  
  useEffect(() => {
    if (!commentRef.current || scriptLoaded.current) return
    
    // 创建script标签加载Cusdis SDK
    const script = document.createElement('script')
    script.src = `${host}/js/widget/lang/${i18nForCusdis}.js`
    script.async = true
    document.head.appendChild(script)
    
    // 创建主脚本
    const mainScript = document.createElement('script')
    mainScript.src = `${host}/js/cusdis.es.js`
    mainScript.async = true
    mainScript.dataset.host = host
    mainScript.dataset.appId = appId
    mainScript.dataset.pageId = pageId
    mainScript.dataset.pageUrl = pageUrl
    mainScript.dataset.pageTitle = pageTitle
    mainScript.dataset.theme = theme
    
    // 脚本加载完成后的处理
    mainScript.onload = () => {
      // 确保旧的评论内容被清除
      if (commentRef.current) {
        commentRef.current.innerHTML = ''
        
        // 创建评论组件的容器
        const commentContainer = document.createElement('div')
        commentContainer.id = 'cusdis_thread'
        commentContainer.dataset.host = host
        commentContainer.dataset.appId = appId
        commentContainer.dataset.pageId = pageId
        commentContainer.dataset.pageUrl = pageUrl
        commentContainer.dataset.pageTitle = pageTitle
        commentContainer.dataset.theme = theme
        
        // 将容器添加到DOM
        commentRef.current.appendChild(commentContainer)
        
        // 初始化Cusdis
        if (window.CUSDIS) {
          window.CUSDIS.initial()
        }
      }
    }
    
    document.head.appendChild(mainScript)
    scriptLoaded.current = true
    
    // 清理函数
    return () => {
      if (scriptLoaded.current) {
        document.head.removeChild(script)
        document.head.removeChild(mainScript)
        scriptLoaded.current = false
      }
    }
  }, [host, appId, pageId, pageUrl, pageTitle, theme, isDarkMode, lang])
  
  return (
    <div 
      className="cusdis-container w-full overflow-visible my-4"
      ref={commentRef}
    />
  )
}

export default CusdisNoIframe
