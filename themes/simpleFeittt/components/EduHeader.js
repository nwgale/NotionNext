import { siteConfig } from '@/lib/config'

/**
 * 教育版页面顶部组件
 * 使用EDU_HEADER_BACKGROUND_IMG, EDU_TITLE, EDU_DESCRIPTION字段
 * @param {Object} props - 组件属性
 * @param {Object} props.post - 页面数据，包含EDU相关字段
 * @returns JSX元素
 */
export default function EduHeader({ post }) {
  // 从post中获取教育版特定字段
  const eduTitle = post?.EDU_TITLE || post?.title || 'Education Page'
  const eduDescription = post?.EDU_DESCRIPTION || post?.summary || ''
  const eduBackgroundImg = post?.EDU_HEADER_BACKGROUND_IMG || ''
  
  // 背景图片配置
  const bgPosition = siteConfig('HEADER_BACKGROUND_POSITION') || 'center'
  const bgSize = siteConfig('HEADER_BACKGROUND_SIZE') || 'cover'
  const bgDarken = parseFloat(siteConfig('HEADER_BACKGROUND_DARKEN') || '0.3')
  const headerHeight = siteConfig('HEADER_HEIGHT') || '400px'
  
  // 文字颜色配置
  const titleColor = siteConfig('HEADER_TITLE_COLOR') || '#ffffff'
  const descriptionColor = siteConfig('HEADER_DESCRIPTION_COLOR') || '#f0f0f0'

  return (
    <header className='relative z-10'>
      {/* 教育版背景区域 */}
      <div 
        className='w-full py-16 bg-blue-600 dark:bg-blue-800 relative flex items-center justify-center'
        style={{
          height: headerHeight,
          ...(eduBackgroundImg ? { 
            backgroundImage: `url(${eduBackgroundImg})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPosition,
            backgroundRepeat: 'no-repeat'
          } : {})
        }}
      >
        {/* 背景暗化层 */}
        {eduBackgroundImg && bgDarken > 0 && (
          <div 
            className='absolute inset-0' 
            style={{ 
              backgroundColor: `rgba(0,0,0,${bgDarken})`,
              zIndex: 1 
            }}
          />
        )}
        
        {/* 内容区域 */}
        <div className='container mx-auto max-w-6xl relative px-4' style={{ zIndex: 2 }}>
          <div className='text-center'>
            <h1 
              className='text-5xl font-bold mb-6'
              style={{ color: titleColor }}
            >
              {eduTitle}
            </h1>
            {eduDescription && (
              <p 
                className='text-xl max-w-3xl mx-auto leading-relaxed'
                style={{ color: descriptionColor }}
              >
                {eduDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}