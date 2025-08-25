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
  
  // ===== 背景图片相关配置 =====
  // 背景图片URL，如果没有设置则使用默认颜色
  // 在Notion配置中心添加HEADER_BACKGROUND_IMG配置项，值为图片URL
  // 例如：https://source.unsplash.com/random/1920x400
  const bgImageUrl = siteConfig('HEADER_BACKGROUND_IMG') || null
  
  // 背景图片位置
  // 可选值：'center'（居中）, 'top'（顶部）, 'bottom'（底部）等
  // 在Notion配置中心添加HEADER_BACKGROUND_POSITION配置项
  const bgPosition = siteConfig('HEADER_BACKGROUND_POSITION') || 'center'
  
  // 背景图片大小
  // 可选值：'cover'（覆盖）, 'contain'（包含）, 'auto'（自动）等
  // 在Notion配置中心添加HEADER_BACKGROUND_SIZE配置项
  const bgSize = siteConfig('HEADER_BACKGROUND_SIZE') || 'cover'
  
  // 背景图片暗化程度（0-1之间的数值，0表示不暗化，1表示完全黑色）
  // 在Notion配置中心添加HEADER_BACKGROUND_DARKEN配置项
  // 例如：0.5表示50%的暗化程度
  const bgDarken = parseFloat(siteConfig('HEADER_BACKGROUND_DARKEN') || '0')
  
  // 背景图片高度
  // 在Notion配置中心添加HEADER_HEIGHT配置项
  // 例如：'300px'或'20rem'
  const headerHeight = siteConfig('HEADER_HEIGHT') || 'auto'

  // 标题文字颜色
  // 在Notion配置中心添加HEADER_TITLE_COLOR配置项
  // 例如：'#ffffff'或'white'
  const titleColor = siteConfig('HEADER_TITLE_COLOR') || ''
  
  // 描述文字颜色
  // 在Notion配置中心添加HEADER_DESCRIPTION_COLOR配置项
  // 例如：'#cccccc'或'gray'
  const descriptionColor = siteConfig('HEADER_DESCRIPTION_COLOR') || ''

  return (
    <header className='relative z-10'>
      {/* 顶部背景区域 */}
      <div 
        className='w-full py-16 bg-pink-200 dark:bg-pink-900 relative'
        style={{
          height: headerHeight !== 'auto' ? headerHeight : 'auto',
          ...(bgImageUrl ? { 
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPosition,
            position: 'relative'
          } : {})
        }}
      >
        {/* 背景暗化层 */}
        {bgImageUrl && bgDarken > 0 && (
          <div 
            className='absolute inset-0' 
            style={{ 
              backgroundColor: `rgba(0,0,0,${bgDarken})`,
              zIndex: 1 
            }}
          />
        )}
        
        {/* 内容区域 */}
        <div className='container mx-auto max-w-6xl relative' style={{ zIndex: 2 }}>
          <div className='pl-6'>
            <h1 
              className='text-4xl font-bold mb-4 text-left'
              style={{ color: titleColor || 'inherit' }}
            >
              {siteTitle || 'My Website'}
            </h1>
            <p 
              className='text-xl text-left'
              style={{ color: descriptionColor || 'inherit' }}
            >
              {siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
