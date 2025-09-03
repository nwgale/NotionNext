import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import Comment from '@/components/Comment'
import ShareBar from '@/components/ShareBar'

/**
 * 博客文章底部信息
 * @param {*} props
 * @returns
 */
export default function BlogPostMini(props) {
  const { post } = props
  const { locale } = useGlobal()

  if (!post) {
    return <></>
  }

  return (
    <div className="mt-6 mb-6">
      {/* 分享 */}
      <ShareBar post={post} />

      {/* 评论区 */}
      {siteConfig('COMMENT_TWIKOO_ENV') && <Comment frontMatter={post} />}
    </div>
  )
}