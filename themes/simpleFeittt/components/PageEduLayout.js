import { useGlobal } from '@/lib/global'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { isBrowser } from '@/lib/utils'
import NotionPage from '@/components/NotionPage'
import { ArticleLock } from './ArticleLock'
import BlogPostMini from './BlogPostMini'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import Comment from '@/components/Comment'
import ShareBar from '@/components/ShareBar'
import Head from 'next/head'
import BLOG from '@/blog.config'

/**
 * PageEdu类型页面布局 - 完全独立的布局，不显示导航菜单和右侧边栏
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
  
  // 从Notion数据库中获取教育版特定字段
  const eduTitle = post?.EDU_TITLE || post?.title || ''
  const eduDescription = post?.EDU_DESCRIPTION || post?.description || ''
  const eduHeaderImage = post?.EDU_HEADER_BACKGROUND_IMG || post?.pageCoverThumbnail || post?.page_cover || ''

  // 文章加锁
  if (lock && !validPassword) {
    return <ArticleLock validPassword={validPassword} />
  }

  // 跳转到评论区
  const scrollToComment = () => {
    if (targetRef && targetRef.current) {
      window.scrollTo({
        top: targetRef.current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div id="edu-page-container" className="bg-white dark:bg-black min-h-screen">
      <Head>
        <title>{eduTitle} - {BLOG.TITLE}</title>
        <meta name="description" content={eduDescription} />
        <meta property="og:title" content={eduTitle} />
        <meta property="og:description" content={eduDescription} />
        <meta property="og:image" content={eduHeaderImage} />
        <meta property="og:type" content="article" />
      </Head>

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

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-5 py-10">
        <article itemScope itemType="https://schema.org/Article" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {/* Notion文章主体 */}
          <div className="prose dark:prose-dark max-w-none">
            {post && (<NotionPage post={post} />)}
          </div>

          {/* 分享 */}
          <div className="mt-8">
            <ShareBar post={post} />
          </div>

          {/* 广告 */}
          <div className="my-8">
            <AdSlot type='in-article' />
          </div>

          {/* 评论区 */}
          <div ref={targetRef} className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">评论</h3>
            <Comment frontMatter={post} />
          </div>
        </article>

        {/* 页脚 */}
        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 py-5">
          <div className="mb-2">
            © {new Date().getFullYear()} {BLOG.AUTHOR}. All rights reserved.
          </div>
          <div>
            Powered by <a href="https://github.com/tangly1024/NotionNext" target="_blank" rel="noreferrer" className="underline">NotionNext</a>
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <div className="fixed right-4 bottom-4 z-10">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      {/* 跳转到评论按钮 */}
      <div className="fixed right-4 bottom-16 z-10">
        <button 
          onClick={scrollToComment}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
