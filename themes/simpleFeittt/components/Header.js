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
  const siteTitle = siteConfig('TITLE')
  const siteDescription = siteConfig('DESCRIPTION')
  
  // 背景图片URL，如果没有设置则使用默认颜色
  const bgImageUrl = siteConfig('HEADER_BACKGROUND_IMG') || null

  return (
    <header className='relative z-10'>
      {/* 顶部背景区域 */}
      <div 
        className='w-full py-16 text-center bg-pink-200 dark:bg-pink-900 relative'
        style={bgImageUrl ? { 
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className='container mx-auto px-6'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4'>{siteTitle || 'My Website'}</h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>{siteDescription}</p>
        </div>
      </div>
      
      {/* 原有的头部内容 */}
      <div className='text-center justify-between items-center px-6 bg-white dark:bg-black'>
        <div className='float-none inline-block py-12'>
        <SmartLink href='/'>
          {/* 可使用一张单图作为logo */}
          <div className='flex space-x-6 justify-center'>
            <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer justify-center items-center flex'>
              <LazyImage
                priority={true}
                src={siteInfo?.icon}
                className='rounded-full'
                width={100}
                height={100}
                alt={siteConfig('AUTHOR')}
              />
            </div>

            <div className='flex-col flex justify-center'>
              <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>
                {siteConfig('AUTHOR')}
              </div>
              <div
                className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center'
                dangerouslySetInnerHTML={{
                  __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
                }}
              />
            </div>
          </div>
        </SmartLink>

        <div className='flex justify-center'>
          <SocialButton />
        </div>
        <div className='text-xs mt-4 text-gray-500 dark:text-gray-300'>
          {siteConfig('DESCRIPTION')}
        </div>
      </div>
      </div>
    </header>
  )
}
