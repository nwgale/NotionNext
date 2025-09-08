import { siteConfig } from '@/lib/config'
/**
 * 教育版页面顶部组件
 * 使用Notion页面的标题、摘要和封面图
 * @param {Object} props - 组件属性
 * @param {Object} props.post - 页面数据，包含标题、摘要和封面图
 * @returns JSX元素
 */
export default function EduHeader({ post }) {
  // 使用页面自身的标题和摘要
  const eduTitle = post?.title || 'Education Page'
  const eduDescription = post?.summary || ''
  
  // 使用Notion页面的封面图作为背景图
  const eduBackgroundImg = post?.page_cover || post?.pageCover || ''

  // 调试信息
  console.log('EduHeader Debug - Values:', {
    eduTitle,
    eduDescription, 
    eduBackgroundImg
  })

  return (
    <header className='relative z-10'>
      {/* 教育版背景区域 */}
      <div 
        className='w-full py-16 bg-gray-700 dark:bg-gray-800 relative flex items-center justify-center'
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
