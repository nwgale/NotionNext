import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * 解析Markdown格式的链接配置
 * @param {string} markdownText 
 * @returns {Object} 解析后的标题和链接数组
 */
const parseFooterLinks = (markdownText) => {
  if (!markdownText) return { title: '', links: [] }
  
  const lines = markdownText.split('\n').filter(line => line.trim() !== '')
  let title = ''
  const links = []
  
  // 查找标题（以####开头的行）
  const titleLine = lines.find(line => line.trim().startsWith('####'))
  if (titleLine) {
    title = titleLine.replace(/^####\s*/, '').trim()
  }
  
  // 查找链接（Markdown格式的链接）
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  lines.forEach(line => {
    let match
    while ((match = linkRegex.exec(line)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      })
    }
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
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
      <div className='text-yellow-300 container mx-auto max-w-6xl py-6 md:flex flex-wrap md:flex-no-wrap md:justify-between items-center text-sm'>
        <div className='text-center md:text-left'>
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
