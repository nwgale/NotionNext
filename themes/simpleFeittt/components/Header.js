import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import SocialButton from './SocialButton'

/**
 * 网站顶部
 * @returns
 */
export default function Header(props) {
  const { siteInfo } = props
  
  // 获取网站标题和描述
  const siteTitle = siteConfig('TITLE') // 使用TITLE作为网站标题
  const siteDescription = siteConfig('DESCRIPTION')
  
  // 背景图片URL，如果没有设置则使用默认颜色
  const bgImageUrl = siteConfig('HEADER_BACKGROUND_IMG') || null

  return (
    <header className='relative z-10'>
      {/* 顶部背景区域 */}
      <div 
        className='w-full py-16 bg-pink-200 dark:bg-pink-900 relative'
        style={bgImageUrl ? { 
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className='container mx-auto'>
          <div className='px-6 md:px-20 lg:px-14 xl:px-16'>
            <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-left'>{siteTitle || 'My Website'}</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 text-left'>{siteDescription}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
