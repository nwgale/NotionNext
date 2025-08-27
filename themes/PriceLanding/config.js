/**
 * AI产品管理工具落地页主题配置
 */
const CONFIG = {
  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_ENABLE: true, // 开启英雄区
  STARTER_HERO_TITLE_1: 'AI驱动的智能产品管理平台', // 英雄区文字
  STARTER_HERO_TITLE_2: '让数据洞察驱动产品决策，用AI赋能产品经理的每一个选择', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: '免费试用', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: '/sign-up', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '观看演示', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: '#demo', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空

  // 英雄区配图，如需隐藏，改为空值即可 ''
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片
  STARTER_HERO_BANNER_IMAGE: '', // hero区下方的全宽图

  // 顶部右侧导航按钮
  STARTER_NAV_BUTTON_1_TEXT: '登录',
  STARTER_NAV_BUTTON_1_URL: '/sign-in',

  STARTER_NAV_BUTTON_2_TEXT: '注册',
  STARTER_NAV_BUTTON_2_URL: '/sign-up',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关
  STARTER_FEATURE_TITLE: '核心功能', // 特性
  STARTER_FEATURE_TEXT_1: '为产品经理打造的智能工具集', // 特性
  STARTER_FEATURE_TEXT_2: '我们的AI产品管理平台旨在简化产品决策流程，提供数据驱动的洞察，帮助产品经理做出更明智的决策。', // 特性

  STARTER_FEATURE_1_TITLE_1: '智能数据分析', // 特性1
  STARTER_FEATURE_1_TEXT_1: '自动处理和分析用户行为数据，发现隐藏的产品使用模式', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '了解更多', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: '#data-analysis', // 特性1

  STARTER_FEATURE_2_TITLE_1: '需求优先级排序', // 特性2
  STARTER_FEATURE_2_TEXT_1: 'AI算法帮助评估和排序产品需求，确保资源投入到最有价值的功能上', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '了解更多', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: '#prioritization', // 特性2

  STARTER_FEATURE_3_TITLE_1: '竞品智能分析', // 特性3
  STARTER_FEATURE_3_TEXT_1: '自动监控竞争对手产品变化，提供市场洞察和差异化建议', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '了解更多', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: '#competitor-analysis', // 特性3

  STARTER_FEATURE_4_TITLE_1: '用户反馈整合', // 特性4
  STARTER_FEATURE_4_TEXT_1: '集中管理来自各渠道的用户反馈，AI自动分类并提取关键洞察', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '了解更多', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: '#feedback-management', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: '重新定义产品管理流程',
  STARTER_ABOUT_TEXT:
    '我们的AI产品管理平台旨在解决产品经理面临的最大挑战：如何在海量数据中做出正确决策。<br /><br />通过整合人工智能和机器学习技术，我们的平台能够分析用户行为、市场趋势和竞争情报，为产品决策提供数据支持，让产品经理能够专注于创造价值而非处理繁琐的数据工作。',
  STARTER_ABOUT_BUTTON_TEXT: '了解我们的方法论',
  STARTER_ABOUT_BUTTON_URL: '#methodology',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '500+',
  STARTER_ABOUT_TIPS_2: '产品团队',
  STARTER_ABOUT_TIPS_3: '正在使用我们的平台',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: '灵活定价',
  STARTER_PRICING_TEXT_1: '适合各种规模团队的订阅计划',
  STARTER_PRICING_TEXT_2:
    '无论您是独立产品经理还是大型企业团队，我们都提供适合您需求和预算的解决方案。所有计划均包含核心功能，高级功能随着计划升级逐步解锁。',

  STARTER_PRICING_1_TITLE: '初创版',
  STARTER_PRICING_1_PRICE: '99',
  STARTER_PRICING_1_PRICE_CURRENCY: '¥',
  STARTER_PRICING_1_PRICE_PERIOD: '每月',
  STARTER_PRICING_1_HEADER: '适合小型团队',
  STARTER_PRICING_1_FEATURES: '基础数据分析,需求管理,3个项目,5个用户', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '开始试用',
  STARTER_PRICING_1_BUTTON_URL: '/sign-up',

  STARTER_PRICING_2_TAG: '最受欢迎',
  STARTER_PRICING_2_TITLE: '专业版',
  STARTER_PRICING_2_PRICE: '299',
  STARTER_PRICING_2_PRICE_CURRENCY: '¥',
  STARTER_PRICING_2_PRICE_PERIOD: '每月',
  STARTER_PRICING_2_HEADER: '适合中型团队',
  STARTER_PRICING_2_FEATURES: '包含初创版功能,高级数据分析,竞品监控,用户反馈管理,10个项目,15个用户', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '开始试用',
  STARTER_PRICING_2_BUTTON_URL: '/sign-up',

  STARTER_PRICING_3_TITLE: '企业版',
  STARTER_PRICING_3_PRICE: '999',
  STARTER_PRICING_3_PRICE_CURRENCY: '¥',
  STARTER_PRICING_3_PRICE_PERIOD: '每月',
  STARTER_PRICING_3_HEADER: '适合大型团队',
  STARTER_PRICING_3_FEATURES: '包含专业版功能,AI预测分析,自定义集成,专属客户经理,无限项目,无限用户', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '联系销售',
  STARTER_PRICING_3_BUTTON_URL: '/contact',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: '客户评价',
  STARTER_TESTIMONIALS_TEXT_1: '他们如何评价我们的产品',
  STARTER_TESTIMONIALS_TEXT_2:
    '来自各行各业的产品经理和团队正在使用我们的AI产品管理平台，帮助他们做出更明智的产品决策，加速产品迭代。',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '这款AI产品管理工具彻底改变了我们的工作方式。以前我们需要花费大量时间来分析用户数据，现在AI可以自动完成这些工作，让我们能够专注于创造性思考。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '李明',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '某科技公司产品总监',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '需求优先级排序功能非常实用，帮助我们团队避免了很多无谓的争论。AI给出的建议往往能够平衡技术可行性和用户价值，让我们的产品路线图更加合理。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '张伟',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '初创公司创始人',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '竞品分析功能为我们节省了大量时间，AI能够自动监控竞争对手的产品变化，并提供有价值的洞察。这让我们能够快速调整策略，保持市场竞争力。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '王芳',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '电商平台产品经理',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '用户反馈整合功能非常强大，它可以自动从各种渠道收集反馈，并使用AI进行分类和分析。这让我们能够更好地理解用户需求，做出更明智的产品决策。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '刘强',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '金融科技公司产品负责人',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: '常见问题',
  STARTER_FAQ_TEXT_1: '您可能想了解的问题',
  STARTER_FAQ_TEXT_2: '以下是我们的客户经常问到的一些问题，如果您有其他疑问，请随时联系我们的客户支持团队。',

  STARTER_FAQ_1_QUESTION: '这个AI产品管理工具适合什么规模的团队？',
  STARTER_FAQ_1_ANSWER:
    '我们的平台适合各种规模的团队使用，从独立产品经理到大型企业产品团队。我们提供不同级别的订阅计划，可以根据您的团队规模和需求进行选择。',

  STARTER_FAQ_2_QUESTION: '如何开始使用这个平台？',
  STARTER_FAQ_2_ANSWER:
    '注册账号后，您可以立即开始使用我们的平台。我们提供详细的入门指南和视频教程，帮助您快速上手。此外，我们的客户成功团队也会提供一对一的培训和支持。',

  STARTER_FAQ_3_QUESTION: '这个平台如何保护我的数据安全？',
  STARTER_FAQ_3_ANSWER:
    '数据安全是我们的首要任务。我们采用银行级加密技术保护您的数据，并严格遵守GDPR、CCPA等数据保护法规。您的数据始终属于您，我们不会与第三方共享。',

  STARTER_FAQ_4_QUESTION: '我可以将这个平台与其他工具集成吗？',
  STARTER_FAQ_4_ANSWER:
    '是的，我们提供丰富的API和集成选项，可以与Jira、Trello、Slack、GitHub等常用工具无缝集成。企业版用户还可以获得自定义集成支持。',

  // 团队成员区块
  STARTER_TEAM_ENABLE: true, // 团队成员区块开关
  STARTER_TEAM_TITLE: '我们的团队',
  STARTER_TEAM_TEXT_1: '由经验丰富的产品和AI专家组成',
  STARTER_TEAM_TEXT_2:
    '我们的团队由产品管理专家和AI工程师组成，拥有丰富的行业经验，致力于为产品经理打造最实用的AI工具。',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: '陈明',
      STARTER_TEAM_ITEM_DESCRIPTION: '创始人兼CEO'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-02.png',
      STARTER_TEAM_ITEM_NICKNAME: '李华',
      STARTER_TEAM_ITEM_DESCRIPTION: 'AI研发负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-03.png',
      STARTER_TEAM_ITEM_NICKNAME: '张燕',
      STARTER_TEAM_ITEM_DESCRIPTION: '产品总监'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-04.png',
      STARTER_TEAM_ITEM_NICKNAME: '王浩',
      STARTER_TEAM_ITEM_DESCRIPTION: '客户成功负责人'
    }
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: '产品管理洞察',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: '最新资讯与观点',
  STARTER_BLOG_TEXT_2:
    '我们定期发布关于产品管理、AI技术和行业趋势的文章，帮助产品经理不断提升自己的专业能力。',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: '联系我们',
  STARTER_CONTACT_TEXT: '我们期待听到您的声音',
  STARTER_CONTACT_LOCATION_TITLE: '公司地址',
  STARTER_CONTACT_LOCATION_TEXT: '北京市海淀区中关村科技园',
  STARTER_CONTACT_EMAIL_TITLE: '联系邮箱',
  STARTER_CONTACT_EMAIL_TEXT: 'contact@aiproductmanager.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: '', // 基于NoteForm创建，将留言数据存在Notion中

  // 合作伙伴的图标
  STARTER_BRANDS_ENABLE: true, // 合作伙伴开关
  STARTER_BRANDS: [
    {
      IMAGE: '/images/starter/brands/graygrids.svg',
      IMAGE_WHITE: '/images/starter/brands/graygrids-white.svg',
      URL: '#',
      TITLE: '合作伙伴1'
    },
    {
      IMAGE: '/images/starter/brands/lineicons.svg',
      IMAGE_WHITE: '/images/starter/brands/lineicons-white.svg',
      URL: '#',
      TITLE: '合作伙伴2'
    },
    {
      IMAGE: '/images/starter/brands/uideck.svg',
      IMAGE_WHITE: '/images/starter/brands/uideck-white.svg',
      URL: '#',
      TITLE: '合作伙伴3'
    },
    {
      IMAGE: '/images/starter/brands/ayroui.svg',
      IMAGE_WHITE: '/images/starter/brands/ayroui-white.svg',
      URL: '#',
      TITLE: '合作伙伴4'
    },
    {
      IMAGE: '/images/starter/brands/tailgrids.svg',
      IMAGE_WHITE: '/images/starter/brands/tailgrids-white.svg',
      URL: '#',
      TITLE: '合作伙伴5'
    }
  ],

  STARTER_FOOTER_SLOGAN: '用AI重新定义产品管理，让数据驱动每一个产品决策。',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: '产品',
      LINK_GROUP: [
        { TITLE: '功能概览', URL: '#features' },
        { TITLE: '定价', URL: '#pricing' },
        { TITLE: '客户案例', URL: '#case-studies' },
        { TITLE: '产品路线图', URL: '#roadmap' }
      ]
    },
    {
      TITLE: '资源',
      LINK_GROUP: [
        { TITLE: '产品文档', URL: '#docs' },
        { TITLE: '视频教程', URL: '#tutorials' },
        { TITLE: '博客', URL: '/blog' },
        { TITLE: '常见问题', URL: '#faq' }
      ]
    },
    {
      TITLE: '公司',
      LINK_GROUP: [
        { TITLE: '关于我们', URL: '/about' },
        { TITLE: '联系我们', URL: '/contact' },
        { TITLE: '加入我们', URL: '/careers' },
        { TITLE: '媒体报道', URL: '/press' }
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: '最新文章',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: '隐私政策',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '法律声明',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legal-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '服务条款',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-service',

  // 404页面的提示语
  STARTER_404_TITLE: '页面未找到',
  STARTER_404_TEXT: '抱歉，您访问的页面不存在或已被移除。',
  STARTER_404_BACK: '返回首页',

  // 页面底部的行动呼吁模块
  STARTER_CTA_ENABLE: true,
  STARTER_CTA_TITLE: '准备好提升您的产品管理效率了吗？',
  STARTER_CTA_TITLE_2: '立即开始免费试用',
  STARTER_CTA_DESCRIPTION:
    '注册即可获得14天免费试用，无需信用卡。体验AI如何帮助您做出更明智的产品决策。',
  STARTER_CTA_BUTTON: true, // 是否显示按钮
  STARTER_CTA_BUTTON_URL: '/sign-up',
  STARTER_CTA_BUTTON_TEXT: '免费试用',

  STARTER_POST_REDIRECT_ENABLE: false, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: '', // 重定向域名
  STARTER_NEWSLETTER: false // 是否开启邮件订阅
}
export default CONFIG