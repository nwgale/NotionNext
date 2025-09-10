/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return <style jsx global>{`
    
  // 底色
  .dark body{
      background-color: black;
  }
  // 文本不可选取
    .forbid-copy {
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
  
  #theme-simple #announcement-content {
    /* background-color: #f6f6f6; */
  }
  
  #theme-simple .blog-item-title {
    color: #333333; /* 接近黑色的深灰色 */
  }
  
  .dark #theme-simple .blog-item-title {
    color: #d1d5db;
  }
  
  .notion {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  
  /* Cusdis评论区样式优化 - 精简版 */
  #cusdis_thread {
    width: 100% !important;
    max-width: none !important;
    overflow: visible !important;
    min-height: 150px !important;
  }
  
  #cusdis_thread iframe {
    width: 100% !important;
    min-height: 150px !important;
    max-width: none !important;
    border: none !important;
    height: auto !important;
  }
  
  /* 确保评论区容器不受限制 */
  .comment {
    width: 100% !important;
    max-width: none !important;
    overflow: visible !important;
    min-height: auto !important;
  }
  
  /* 添加全局样式以强制iframe内容可见 */
  iframe {
    overflow: visible !important;
  }
  
  /* 移动端优化 */
  @media (max-width: 768px) {
    #cusdis_thread,
    #cusdis_thread iframe {
      min-height: 200px !important;
    }
  }
  
  /*  菜单下划线动画 */
  #theme-simple .menu-link {
      text-decoration: none;
      background-image: linear-gradient(#dd3333, #dd3333);
      background-repeat: no-repeat;
      background-position: bottom center;
      background-size: 0 2px;
      transition: background-size 100ms ease-in-out;
  }
   
  #theme-simple .menu-link:hover {
      background-size: 100% 2px;
      color: #dd3333;
      cursor: pointer;
  }
  
  

  `}</style>
}

export { Style }
