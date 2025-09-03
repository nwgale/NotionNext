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

  // 详细调试信息
  console.log('EduHeader Debug - Field Values:', {
    eduTitle,
    eduDescription, 
    eduBackgroundImg
  })
  
  console.log('EduHeader Debug - Post Keys:', Object.keys(post || {}))
  
  console.log('EduHeader Debug - All Post Data:', post)
  
  // 查找包含EDU的字段
  const eduFields = Object.keys(post || {}).filter(key => 
    key.toLowerCase().includes('edu') || 
    key.includes('EDU') ||
    key.includes('教育') ||
    key.includes('田飞')
  )
  console.log('EduHeader Debug - Found EDU-related fields:', eduFields)
  
  // 显示这些字段的值
  eduFields.forEach(field => {
    console.log(`EduHeader Debug - ${field}:`, post[field])
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
        
        {/* 内容区域 */}
        <div className='container mx-auto max-w-6xl relative px-4' style={{ zIndex: 2 }}>
          <div className='text-center'>
            <h1 className='text-5xl font-bold mb-6 text-white'>
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
