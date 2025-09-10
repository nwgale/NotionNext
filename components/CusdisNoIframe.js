import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import Script from 'next/script'

/**
 * 无iframe版本的Cusdis评论组件
 * 使用自定义实现，直接在页面上渲染评论表单和评论列表
 */
const CusdisNoIframe = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const commentRef = useRef(null)
  const commentsLoaded = useRef(false)
  
  // 获取配置
  const host = siteConfig('COMMENT_CUSDIS_HOST')
  const appId = siteConfig('COMMENT_CUSDIS_APP_ID')
  const pageId = frontMatter.id
  const pageUrl = siteConfig('LINK') + router.asPath
  const pageTitle = frontMatter.title
  const theme = isDarkMode ? 'dark' : 'light'
  
  // 加载评论
  const loadComments = async () => {
    if (!commentRef.current || commentsLoaded.current) return
    
    try {
      // 创建评论表单
      const formHtml = `
        <div class="cusdis-form">
          <h3>Leave a comment</h3>
          <div class="cusdis-form-input">
            <input type="text" id="cusdis-nickname" placeholder="Nickname" />
          </div>
          <div class="cusdis-form-input">
            <input type="email" id="cusdis-email" placeholder="Email (optional)" />
          </div>
          <div class="cusdis-form-input">
            <textarea id="cusdis-content" placeholder="Reply..."></textarea>
          </div>
          <button id="cusdis-submit">Comment</button>
        </div>
        <div id="cusdis-comments-container"></div>
      `
      
      // 添加表单到DOM
      commentRef.current.innerHTML = formHtml
      
      // 添加样式
      const style = document.createElement('style')
      style.textContent = `
        .cusdis-form {
          margin-bottom: 20px;
        }
        .cusdis-form h3 {
          margin-bottom: 15px;
          font-size: 1.2rem;
        }
        .cusdis-form-input {
          margin-bottom: 15px;
        }
        .cusdis-form-input input,
        .cusdis-form-input textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .cusdis-form-input textarea {
          min-height: 100px;
        }
        #cusdis-submit {
          background-color: #1a73e8;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .cusdis-comment {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        .cusdis-comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .cusdis-comment-author {
          font-weight: bold;
        }
        .cusdis-comment-date {
          color: #666;
          font-size: 0.9rem;
        }
        .dark .cusdis-form-input input,
        .dark .cusdis-form-input textarea {
          background-color: #333;
          color: #fff;
          border-color: #555;
        }
        .dark .cusdis-comment {
          border-color: #444;
          background-color: #333;
        }
        .dark .cusdis-comment-date {
          color: #aaa;
        }
      `
      document.head.appendChild(style)
      
      // 获取评论数据
      const fetchComments = async () => {
        try {
          const response = await fetch(`${host}/api/open/comments?appId=${appId}&pageId=${pageId}`)
          const data = await response.json()
          
          if (data.data && Array.isArray(data.data)) {
            const commentsContainer = document.getElementById('cusdis-comments-container')
            if (commentsContainer) {
              if (data.data.length === 0) {
                commentsContainer.innerHTML = '<p>No comments yet.</p>'
              } else {
                const commentsHtml = data.data.map(comment => `
                  <div class="cusdis-comment">
                    <div class="cusdis-comment-header">
                      <span class="cusdis-comment-author">${comment.by_nickname || 'Anonymous'}</span>
                      <span class="cusdis-comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="cusdis-comment-content">${comment.content}</div>
                  </div>
                `).join('')
                
                commentsContainer.innerHTML = commentsHtml
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch comments:', error)
          const commentsContainer = document.getElementById('cusdis-comments-container')
          if (commentsContainer) {
            commentsContainer.innerHTML = '<p>Failed to load comments.</p>'
          }
        }
      }
      
      // 处理评论提交
      const submitBtn = document.getElementById('cusdis-submit')
      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          const nickname = document.getElementById('cusdis-nickname').value
          const email = document.getElementById('cusdis-email').value
          const content = document.getElementById('cusdis-content').value
          
          if (!nickname || !content) {
            alert('Nickname and comment content are required.')
            return
          }
          
          try {
            submitBtn.disabled = true
            submitBtn.textContent = 'Submitting...'
            
            const response = await fetch(`${host}/api/open/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                appId,
                pageId,
                pageUrl,
                pageTitle,
                nickname,
                email,
                content
              })
            })
            
            const result = await response.json()
            
            if (result.id) {
              // 清空表单
              document.getElementById('cusdis-nickname').value = ''
              document.getElementById('cusdis-email').value = ''
              document.getElementById('cusdis-content').value = ''
              
              // 重新加载评论
              fetchComments()
              
              alert('Comment submitted successfully!')
            } else {
              alert('Failed to submit comment. Please try again.')
            }
          } catch (error) {
            console.error('Error submitting comment:', error)
            alert('Failed to submit comment. Please try again.')
          } finally {
            submitBtn.disabled = false
            submitBtn.textContent = 'Comment'
          }
        })
      }
      
      // 加载评论
      fetchComments()
      
      commentsLoaded.current = true
    } catch (error) {
      console.error('Error initializing Cusdis:', error)
      if (commentRef.current) {
        commentRef.current.innerHTML = '<p>Failed to load comments system.</p>'
      }
    }
  }
  
  // 当组件挂载时加载评论
  useEffect(() => {
    loadComments()
    
    return () => {
      commentsLoaded.current = false
    }
  }, [host, appId, pageId, pageUrl, pageTitle, theme, isDarkMode])
  
  return (
    <div 
      className="cusdis-no-iframe w-full overflow-visible my-4"
      ref={commentRef}
    />
  )
}

export default CusdisNoIframe
