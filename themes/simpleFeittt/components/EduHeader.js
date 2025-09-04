import { siteConfig } from '@/lib/config'
/**
 * 教育版页面顶部组件
 * 使用EDU_HEADER_BACKGROUND_IMG, EDU_TITLE, EDU_DESCRIPTION字段
 * @param {Object} props - 组件属性
 * @param {Object} props.post - 页面数据，包含EDU相关字段
 * @returns JSX元素
 */
export default function EduHeader({ post }) {
  // 从配置中心读取教育版特定字段，就像Footer组件一样
  const eduTitle = siteConfig('EDU_TITLE') || post?.title || 'Education Page'
  const eduDescription = siteConfig('EDU_DESCRIPTION') || post?.summary || ''
  const eduBackgroundImg = siteConfig('EDU_HEADER_BACKGROUND_IMG') || ''

  // 调试信息
  console.log('EduHeader Debug - Config Values:', {
    eduTitle,
    eduDescription, 
    eduBackgroundImg,
    configEduTitle: siteConfig('EDU_TITLE'),
    configEduDescription: siteConfig('EDU_DESCRIPTION'),
    configEduBackgroundImg: siteConfig('EDU_HEADER_BACKGROUND_IMG')
  })

  return (
    <header className='relative z-10'>
      {/* 教育版背景区域 */}
      <div 
        className='w-full py-16 bg-blue-600 dark:bg-blue-800 relative flex items-center justify-center'
        style={{
          minHeight: '300px',
          ...(eduBackgroundImg ? { 
            backgroundImage: `url(${eduBackgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          } : {})
        }}
      >
        {/* 背景暗化层 */}
        {eduBackgroundImg && (
          <div 
            className='absolute inset-0 bg-black bg-opacity-30'
            style={{ zIndex: 1 }}
          />
        )}
        
        {/* 左上角首页图标 */}
        <div className='absolute top-4 left-4' style={{ zIndex: 3 }}>
          <a 
            href="/" 
            className='text-white hover:text-gray-200 transition-colors duration-200'
            title="返回首页"
          >
            <i className="fas fa-home text-xl"></i>
          </a>
        </div>
        
        {/* 内容区域 */}
        <div className='container mx-auto max-w-6xl relative px-4' style={{ zIndex: 2 }}>
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-6 text-white'>
              {eduTitle}
            </h1>
            {eduDescription && (
              <p className='text-xl max-w-3xl mx-auto leading-relaxed text-gray-100'>
                {eduDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
