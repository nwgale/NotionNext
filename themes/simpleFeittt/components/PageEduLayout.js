import { useGlobal } from '@/lib/global'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import ArticleDetail from './ArticleDetail'
import Footer from './Footer'
import JumpToCommentButton from './JumpToCommentButton'
import TocDrawer from './TocDrawer'
import { isBrowser } from '@/lib/utils'
import NotionPage from '@/components/NotionPage'
import { ArticleLock } from './ArticleLock'
import BlogPostMini from './BlogPostMini'
import { AdSlot } from '@/components/GoogleAdsense'

/**
 * PageEdu类型页面布局
 * @param {*} props
 * @returns
 */
export default function PageEduLayout(props) {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const { locale } = useGlobal()
  const targetRef = useRef(null)

  if (!post) {
    return <></>
  }

  const { blockMap } = post
  const pageTitle = post?.title || ''
  const description = post?.description || ''
  const headerImage = post?.pageCoverThumbnail || post?.page_cover || ''
  
  // 从Notion数据库中获取教育版特定字段
  const eduTitle = post?.EDU_TITLE || post?.title || ''
  const eduDescription = post?.EDU_DESCRIPTION || post?.description || ''
  const eduHeaderImage = post?.EDU_HEADER_BACKGROUND_IMG || post?.pageCoverThumbnail || post?.page_cover || ''

  // 获取目录
  const toc = getPageTableOfContents(post, blockMap)

  // 文章加锁
  if (lock && !validPassword) {
    return <ArticleLock validPassword={validPassword} />
  }

  return (
    <div className="w-full mx-auto lg:pt-8 md:pt-5 px-5 dark:text-gray-300">
      <div className="w-full relative">
        {/* 顶部背景图 */}
        <div className="w-full h-[300px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" 
               style={{ backgroundImage: `url('${eduHeaderImage}')` }}>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-start p-10">
              <div className="text-5xl font-bold text-white mb-4">{eduTitle}</div>
              <div className="text-xl text-white">{eduDescription}</div>
            </div>
          </div>
        </div>

        <div id="container" className="mt-10 px-10 pb-12 shadow-md dark:shadow-hexo-black-gray min-h-screen bg-white dark:bg-hexo-black-gray">
          {/* 文章详情 */}
          <div id="article-wrapper" className="flex-grow">
            <article itemScope itemType="https://schema.org/Article">
              {/* Notion文章主体 */}
              <section className="px-5">
                {post && (<NotionPage post={post} />)}
              </section>

              {/* 广告 */}
              <AdSlot type='in-article' />
            </article>

            <JumpToCommentButton targetRef={targetRef} />
          </div>

          {/* 评论区 */}
          <div ref={targetRef} className="pt-4 px-1">
            <BlogPostMini post={post} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}