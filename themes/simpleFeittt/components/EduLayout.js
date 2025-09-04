import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import NotionPage from '@/components/NotionPage'
import EduHeader from './EduHeader'

// 动态导入组件
const Footer = dynamic(() => import('./Footer'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./JumpToTopButton'), { ssr: false })

/**
 * 教育版页面布局组件
 * 不包含导航栏和侧边栏，只有头部、内容和页脚
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 页面内容
 * @param {Object} props.post - 页面数据
 * @param {Object} props.siteInfo - 网站信息
 * @returns JSX元素
 */
export default function EduLayout(props) {
  const { post, siteInfo, ...rest } = props
  const router = useRouter()

  useEffect(() => {
    // 加载主题相关的外部资源
    if (isBrowser) {
      loadExternalResource('/css/theme-simpleFeittt.css', 'css')
    }
  }, [])

  return (
    <div id='theme-simpleFeittt' className='min-h-screen flex flex-col bg-white dark:bg-gray-900'>
      {/* 教育版头部 */}
      <EduHeader post={post} siteInfo={siteInfo} />
      
      {/* 主要内容区域 */}
      <main className='flex-1'>
        <div className='container mx-auto max-w-3xl px-4 py-8'>
          <div className='w-full'>
            {/* 渲染Notion页面内容 */}
            <NotionPage post={post} />
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <Footer {...rest} />
      
      {/* 返回顶部按钮 */}
      <div className='fixed right-4 bottom-4 z-20'>
        <JumpToTopButton />
      </div>
    </div>
  )
}
