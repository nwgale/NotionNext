import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

const CusdisComponent = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')
  const i18nForCusdis = siteConfig('LANG').toLowerCase().indexOf('zh') === 0 ? siteConfig('LANG').toLowerCase() : siteConfig('LANG').toLowerCase().substring(0, 2)
  const langCDN = siteConfig('COMMENT_CUSDIS_LANG_SRC', `https://cusdis.com/js/widget/lang/${i18nForCusdis}.js`)
  const threadRef = useRef(null)
  
  // 加载Cusdis脚本并设置消息监听器
  useEffect(() => {
    // 清除已有的脚本，确保重新加载
    const existingScripts = document.querySelectorAll('script[data-cusdis]')
    existingScripts.forEach(script => script.remove())
    
    // 加载语言脚本
    const langScript = document.createElement('script')
    langScript.src = langCDN
    langScript.async = true
    langScript.setAttribute('data-cusdis', 'lang')
    document.head.appendChild(langScript)
    
    // 加载主脚本
    const mainScript = document.createElement('script')
    mainScript.src = src
    mainScript.async = true
    mainScript.setAttribute('data-cusdis', 'main')
    mainScript.onload = () => {
      if (window.CUSDIS) {
        window.CUSDIS.initial()
      }
    }
    document.head.appendChild(mainScript)
    
    // 添加消息监听器处理iframe高度调整
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.from === 'cusdis' && data.event === 'resize') {
          const iframe = document.querySelector('#cusdis_thread iframe')
          if (iframe) {
            // 只添加小的缓冲区，更接近官方实现
            const newHeight = parseInt(data.data) + 50
            iframe.style.height = `${newHeight}px`
            iframe.style.minHeight = '350px' // 降低最小高度
          }
        }
      } catch (error) {
        // 忽略非JSON消息
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    // 使用MutationObserver监听评论区变化
    const observer = new MutationObserver(() => {
      const iframe = document.querySelector('#cusdis_thread iframe')
      if (iframe && iframe.contentWindow) {
        // 尝试触发重新计算高度
        try {
          iframe.contentWindow.postMessage('resize', '*')
        } catch (e) {
          // 忽略跨域错误
        }
      }
    })
    
    // 监听评论区变化
    if (threadRef.current) {
      observer.observe(threadRef.current, {
        childList: true,
        subtree: true
      })
    }
    
    // 初始化时设置基础样式
    const initIframe = () => {
      const iframe = document.querySelector('#cusdis_thread iframe')
      if (iframe) {
        iframe.style.width = '100%'
        iframe.style.minHeight = '350px' // 降低最小高度
        iframe.style.border = 'none'
        iframe.style.overflow = 'visible'
      } else {
        // 如果还没加载完成，稍后再试
        setTimeout(initIframe, 500)
      }
    }
    
    setTimeout(initIframe, 500)
    
    return () => {
      window.removeEventListener('message', handleMessage)
      observer.disconnect()
    }
  }, [isDarkMode, lang, src, langCDN])
  
  return (
    <div 
      id="cusdis_thread"
      ref={threadRef}
      className="w-full overflow-visible"
      style={{ minHeight: '350px' }}
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
