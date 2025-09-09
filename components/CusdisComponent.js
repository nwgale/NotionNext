import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

const CusdisComponent = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')
  const i18nForCusdis = siteConfig('LANG').toLowerCase().indexOf('zh') === 0 ? siteConfig('LANG').toLowerCase() : siteConfig('LANG').toLowerCase().substring(0, 2)
  const langCDN = siteConfig('COMMENT_CUSDIS_LANG_SRC', `https://cusdis.com/js/widget/lang/${i18nForCusdis}.js`)
  
  // 检测是否在微信环境中
  const [isWechat, setIsWechat] = useState(false)
  const [loadAttempted, setLoadAttempted] = useState(false)
  
  // 在客户端初始化时检测微信环境
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isWechatBrowser = /MicroMessenger/i.test(navigator.userAgent)
      setIsWechat(isWechatBrowser)
    }
  }, [])

  // 处理cusdis主题和加载
  useEffect(() => {
    if (isWechat) {
      // 微信环境特殊处理
      console.log('Detected WeChat environment, using special loading strategy')
      loadCusdisForWechat()
    } else {
      // 正常环境
      loadCusdis()
    }
  }, [isDarkMode, lang, isWechat])

  const loadCusdis = async () => {
    if (loadAttempted) return
    setLoadAttempted(true)
    
    try {
      await loadExternalResource(langCDN, 'js')
      await loadExternalResource(src, 'js')
      window?.CUSDIS?.initial()
    } catch (error) {
      console.error('Failed to load Cusdis:', error)
    }
  }
  
  // 微信环境专用加载函数
  const loadCusdisForWechat = async () => {
    if (loadAttempted) return
    setLoadAttempted(true)
    
    // 延迟加载，给微信浏览器更多时间准备DOM
    setTimeout(async () => {
      try {
        await loadExternalResource(langCDN, 'js')
        await loadExternalResource(src, 'js')
        
        // 确保DOM已完全加载
        if (document.readyState === 'complete') {
          window?.CUSDIS?.initial()
        } else {
          window.addEventListener('load', () => {
            window?.CUSDIS?.initial()
          })
        }
      } catch (error) {
        console.error('Failed to load Cusdis in WeChat:', error)
      }
    }, 1500) // 延迟1.5秒
  }

  // 条件渲染：如果多次尝试后在微信中仍然无法加载，则显示提示信息
  if (isWechat && loadAttempted) {
    return (
      <>
        {/* 正常的Cusdis容器 */}
        <div id="cusdis_thread"
          lang={lang.toLowerCase()}
          data-host={siteConfig('COMMENT_CUSDIS_HOST')}
          data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
          data-page-id={frontMatter.id}
          data-page-url={siteConfig('LINK') + router.asPath}
          data-page-title={frontMatter.title}
          data-theme={isDarkMode ? 'dark' : 'light'}
        ></div>
        
        {/* 微信环境下的备用提示 */}
        <div className="text-center p-4 border rounded my-4 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm mb-2">评论功能在微信中可能无法正常显示</p>
          <a 
            href={`https://tianfei.chat${router.asPath}`} 
            className="text-blue-500 underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            在浏览器中打开以获得完整体验
          </a>
        </div>
      </>
    )
  }
  
  // 正常环境下的渲染
  return (
    <div id="cusdis_thread"
      lang={lang.toLowerCase()}
      data-host={siteConfig('COMMENT_CUSDIS_HOST')}
      data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
      data-page-id={frontMatter.id}
      data-page-url={siteConfig('LINK') + router.asPath}
      data-page-title={frontMatter.title}
      data-theme={isDarkMode ? 'dark' : 'light'}
    ></div>
  )
}

export default CusdisComponent
