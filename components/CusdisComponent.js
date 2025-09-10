import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

const CusdisComponent = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')
  const i18nForCusdis = siteConfig('LANG').toLowerCase().indexOf('zh') === 0 ? siteConfig('LANG').toLowerCase() : siteConfig('LANG').toLowerCase().substring(0, 2)
  const langCDN = siteConfig('COMMENT_CUSDIS_LANG_SRC', `https://cusdis.com/js/widget/lang/${i18nForCusdis}.js`)
  const threadRef = useRef(null)
  const [iframeHeight, setIframeHeight] = useState(300) // 默认高度
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const resizeObserverRef = useRef(null)
  
  // 处理cusdis主题和iframe高度调整
  useEffect(() => {
    // 加载Cusdis脚本
    const loadCusdisScripts = async () => {
      try {
        await loadExternalResource(langCDN, 'js')
        await loadExternalResource(src, 'js')
        
        if (window?.CUSDIS) {
          window.CUSDIS.initial()
          setIframeLoaded(true)
        }
      } catch (error) {
        console.error('Failed to load Cusdis:', error)
      }
    }
    
    loadCusdisScripts()
    
    // 处理iframe高度调整的消息
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.from === 'cusdis' && data.event === 'resize') {
          // 设置iframe高度，额外添加空间以避免滚动条
          const newHeight = parseInt(data.data) + 100
          setIframeHeight(newHeight)
        }
      } catch (error) {
        // 忽略非JSON消息
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // 使用ResizeObserver监控iframe大小变化
    if (threadRef.current && !resizeObserverRef.current && 'ResizeObserver' in window) {
      const setupResizeObserver = () => {
        const iframe = threadRef.current?.querySelector('iframe')
        if (iframe) {
          resizeObserverRef.current = new ResizeObserver(entries => {
            for (const entry of entries) {
              const contentHeight = entry.contentRect.height
              if (contentHeight > 0 && contentHeight !== iframeHeight) {
                setIframeHeight(contentHeight + 100)
              }
            }
          })
          
          resizeObserverRef.current.observe(iframe)
        } else {
          // 如果iframe还没加载，稍后再试
          setTimeout(setupResizeObserver, 1000)
        }
      }
      
      // 延迟执行以确保iframe已加载
      setTimeout(setupResizeObserver, 1000)
    }
    
    return () => {
      window.removeEventListener('message', handleMessage)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [isDarkMode, lang, src, langCDN])
  
  // 监控iframe加载后应用样式
  useEffect(() => {
    if (!iframeLoaded) return
    
    const applyStyles = () => {
      const iframe = threadRef.current?.querySelector('iframe')
      if (iframe) {
        // 设置iframe样式
        iframe.style.width = '100%'
        iframe.style.height = `${iframeHeight}px`
        iframe.style.border = 'none'
        iframe.style.overflow = 'visible'
        iframe.style.transition = 'height 0.3s ease'
        
        // 尝试修改iframe内部样式
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          if (iframeDoc) {
            const style = iframeDoc.createElement('style')
            style.textContent = `
              body { overflow: visible !important; }
              .comment-container { max-height: none !important; }
              .comments { max-height: none !important; }
            `
            iframeDoc.head.appendChild(style)
          }
        } catch (e) {
          console.log('Cannot access iframe content due to same-origin policy')
        }
      } else {
        // 如果iframe还没加载，稍后再试
        setTimeout(applyStyles, 500)
      }
    }
    
    applyStyles()
  }, [iframeLoaded, iframeHeight])
  
  return (
    <div 
      id="cusdis_thread"
      ref={threadRef}
      className="w-full overflow-visible"
      style={{ minHeight: `${iframeHeight}px` }}
      lang={lang.toLowerCase()}
      data-host={siteConfig('COMMENT_CUSDIS_HOST')}
      data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
      data-page-id={frontMatter.id}
      data-page-url={siteConfig('LINK') + router.asPath}
      data-page-title={frontMatter.title}
      data-theme={isDarkMode ? 'dark' : 'light'}
    />
  )
}

export default CusdisComponent
