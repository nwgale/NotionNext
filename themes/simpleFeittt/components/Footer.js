import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * 解析页脚链接配置，兼容以下格式：
 * - Markdown 链接：[个人简介](/about)
 * - 文本+链接：个人简介(/about)
 * - 纯文本：个人简介
 */
const parseFooterLinks = configText => {
  if (!configText) return { title: '', links: [] }

  const lines = configText.split('\n').filter(line => line.trim() !== '')
  let title = ''
  const links = []

  // 标题行：#### 标题
  const titleLine = lines.find(line => line.trim().startsWith('####'))
  if (titleLine) {
    title = titleLine.replace(/^####\s*/, '').trim()
  }

  lines.forEach(line => {
    if (line.trim().startsWith('####')) return

    // 兼容 markdown 列表前缀：-, *, 1.
    const normalizedLine = line
      .trim()
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .trim()
    if (!normalizedLine) return

    // 格式1：Markdown [text](url)
    const markdownLinkMatch = normalizedLine.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (markdownLinkMatch) {
      links.push({
        text: markdownLinkMatch[1].trim(),
        url: markdownLinkMatch[2].trim()
      })
      return
    }

    // 格式2：text(url)
    const textLinkMatch = normalizedLine.match(/^(.+?)\s*\((.+?)\)$/)
    if (textLinkMatch) {
      links.push({
        text: textLinkMatch[1].trim(),
        url: textLinkMatch[2].trim()
      })
      return
    }

    // 格式3：纯文本
    links.push({
      text: normalizedLine,
      url: '#'
    })
  })

  return { title, links }
}

/**
 * 页脚
 * @param {*} props
 * @returns
 */
export default function Footer(props) {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
    
  // 解析四个链接区域的配置
  const footerLink1 = parseFooterLinks(siteConfig('FOOTER_LINK1'))
  const footerLink2 = parseFooterLinks(siteConfig('FOOTER_LINK2'))
  const footerLink3 = parseFooterLinks(siteConfig('FOOTER_LINK3'))
  const footerLink4 = parseFooterLinks(siteConfig('FOOTER_LINK4'))
  
  // 检查是否有任何链接区域配置
  const hasLinks = footerLink1.links.length > 0 || 
                   footerLink2.links.length > 0 || 
                   footerLink3.links.length > 0 || 
                   footerLink4.links.length > 0

  return (
    <footer className='relative w-full bg-black px-6 border-t'>
      <DarkModeButton className='text-center pt-4' />
      
      {/* 链接区域 */}
      {hasLinks && (
        <div className='container mx-auto max-w-6xl py-12 border-b border-gray-800'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {/* 第一列链接 */}
            {footerLink1.links.length > 0 && (
              <div className='mb-6'>
                {footerLink1.title && (
                  <h4 className='text-white text-lg font-bold mb-4'>{footerLink1.title}</h4>
                )}
                <ul>
                  {footerLink1.links.map((link, index) => (
                    <li key={`link1-${index}`} className='mb-2'>
                      <SmartLink href={link.url} className='text-gray-400 hover:text-white transition-colors'>
                        {link.text}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 第二列链接 */}
            {footerLink2.links.length > 0 && (
              <div className='mb-6'>
                {footerLink2.title && (
                  <h4 className='text-white text-lg font-bold mb-4'>{footerLink2.title}</h4>
                )}
                <ul>
                  {footerLink2.links.map((link, index) => (
                    <li key={`link2-${index}`} className='mb-2'>
                      <SmartLink href={link.url} className='text-gray-400 hover:text-white transition-colors'>
                        {link.text}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 第三列链接 */}
            {footerLink3.links.length > 0 && (
              <div className='mb-6'>
                {footerLink3.title && (
                  <h4 className='text-white text-lg font-bold mb-4'>{footerLink3.title}</h4>
                )}
                <ul>
                  {footerLink3.links.map((link, index) => (
                    <li key={`link3-${index}`} className='mb-2'>
                      <SmartLink href={link.url} className='text-gray-400 hover:text-white transition-colors'>
                        {link.text}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 第四列链接 */}
            {footerLink4.links.length > 0 && (
              <div className='mb-6'>
                {footerLink4.title && (
                  <h4 className='text-white text-lg font-bold mb-4'>{footerLink4.title}</h4>
                )}
                <ul>
                  {footerLink4.links.map((link, index) => (
                    <li key={`link4-${index}`} className='mb-2'>
                      <SmartLink href={link.url} className='text-gray-400 hover:text-white transition-colors'>
                        {link.text}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 版权信息区域 */}
      <div className='text-gray-400 container mx-auto max-w-6xl py-6 md:flex flex-wrap md:flex-no-wrap md:justify-between items-center text-sm'>
        <div className='text-center md:text-left flex items-center'>
          {/* RSS订阅图标 */}
          <a href='/rss/feed.xml' target='_blank' rel='noreferrer' className='mr-2 hover:text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
              <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z" />
              <circle cx="5" cy="15" r="1.5" />
            </svg>
          </a>
          
          {/* 深色/浅色模式切换图标 */}
          <div className='mr-2 cursor-pointer hover:text-white'>
            <DarkModeButton className='inline-block !text-gray-400 hover:!text-white' />
          </div>
          
          &copy;{`${copyrightDate}`} {siteConfig('AUTHOR')}. All rights
          reserved.
        </div>
        <div className='md:p-0 text-center md:text-right text-xs'>
          {/* 右侧链接 */}
          {siteConfig('BEI_AN') && (
            <a
              href={siteConfig('BEI_AN_LINK')}
              className='no-underline hover:underline ml-4'>
              {siteConfig('BEI_AN')}
            </a>
          )}
          <BeiAnGongAn />
          <span className='no-underline ml-4'>
            Powered by
            <a
              href='https://github.com/tangly1024/NotionNext'
              className=' hover:underline'>
              NotionNext {siteConfig('VERSION')}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
