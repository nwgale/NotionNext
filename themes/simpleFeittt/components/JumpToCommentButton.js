import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 跳转到评论区
 * @param {*} param0
 * @returns
 */
export default function JumpToCommentButton({ targetRef }) {
  const { locale } = useGlobal()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const scrollListener = () => {
      const scrollY = window.pageYOffset
      const threshold = 300
      setShow(scrollY > threshold)
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  function navToComment() {
    if (targetRef && targetRef.current) {
      window.scrollTo({
        top: targetRef.current.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      onClick={navToComment}
      className={`${show ? 'opacity-100' : 'opacity-0'} cursor-pointer fixed right-2 bottom-24 z-30 transition-all duration-200 bg-gray-100 dark:bg-gray-800 rounded-full shadow-2xl hover:shadow-none p-2`}
    >
      <i className="fas fa-comment text-xl text-gray-500 dark:text-gray-200" />
    </div>
  )
}