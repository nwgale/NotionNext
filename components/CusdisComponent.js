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
  const iframeRef = useRef(null)

  // 处理cusdis主题
  useEffect(() => {
    loadCusdis()
    
    // 添加消息监听器，处理iframe高度调整
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.from === 'cusdis' && data.event === 'resize' && iframeRef.current) {
          // 设置iframe高度，额外添加一些空间以避免滚动条
          iframeRef.current.style.height = (parseInt(data.data) + 50) + 'px'
        }
      } catch (error) {
        // 忽略非JSON消息
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isDarkMode, lang])

  const loadCusdis = async () => {
    await loadExternalResource(langCDN, 'js')
    await loadExternalResource(src, 'js')

    // 自定义Cusdis初始化
    if (window?.CUSDIS) {
      // 保存原始的renderTo函数
      const originalRenderTo = window.CUSDIS.renderTo
      
      // 重写renderTo函数，获取iframe引用
      window.CUSDIS.renderTo = (element) => {
        originalRenderTo(element)
        
        // 获取iframe引用
        if (element) {
          const iframe = element.querySelector('iframe')
          if (iframe) {
            iframeRef.current = iframe
            iframe.style.width = '100%'
            iframe.style.minHeight = '300px'
            iframe.style.border = 'none'
            iframe.style.overflow = 'hidden'
          }
        }
      }
      
      window.CUSDIS.initial()
    }
  }

  return <div id="cusdis_thread"
        className="w-full overflow-visible"
        lang={lang.toLowerCase()}
        data-host={siteConfig('COMMENT_CUSDIS_HOST')}
        data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
        data-page-id={frontMatter.id}
        data-page-url={siteConfig('LINK') + router.asPath}
        data-page-title={frontMatter.title}
        data-theme={isDarkMode ? 'dark' : 'light'}
    ></div>
}

export default CusdisComponent
