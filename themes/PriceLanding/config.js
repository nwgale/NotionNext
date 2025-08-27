/**
 * 价格翻译官落地页主题配置
 */
const CONFIG = {
  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_ENABLE: true, // 开启英雄区
  STARTER_HERO_TITLE_1: '价格翻译官 - 旅行中的价格参照神器', // 英雄区文字
  STARTER_HERO_TITLE_2: '让您在国外旅行时，一眼就能理解当地物价，轻松做出消费决策', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: '立即下载', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: 'https://apps.apple.com/app/id6749685008', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '了解更多', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: '#features', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空

  // 英雄区配图，如需隐藏，改为空值即可 ''
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片
  STARTER_HERO_BANNER_IMAGE: '', // hero区下方的全宽图

  // 顶部右侧导航按钮
  STARTER_NAV_BUTTON_1_TEXT: '下载iOS版',
  STARTER_NAV_BUTTON_1_URL: 'https://apps.apple.com/app/id6749685008',

  STARTER_NAV_BUTTON_2_TEXT: '下载安卓版',
  STARTER_NAV_BUTTON_2_URL: 'https://play.google.com/store/apps/details?id=com.quickwis.pricetranslator',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关
  STARTER_FEATURE_TITLE: '产品特点', // 特性
  STARTER_FEATURE_TEXT_1: '专为旅行者设计的价格参照工具', // 特性
  STARTER_FEATURE_TEXT_2: '价格翻译官专注解决一个问题：让您在国外旅行时，能够快速理解当地物价，不再为陌生货币感到困惑。', // 特性

  STARTER_FEATURE_1_TITLE_1: '极致简洁', // 特性1
  STARTER_FEATURE_1_TEXT_1: '无需打开App，桌面小组件一键转换，操作零门槛', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '了解更多', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: '#simplicity', // 特性1

  STARTER_FEATURE_2_TITLE_1: '直观参照', // 特性2
  STARTER_FEATURE_2_TEXT_1: '不只是数字转换，还提供国内熟悉商品的价格参照', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '了解更多', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: '#reference', // 特性2

  STARTER_FEATURE_3_TITLE_1: '专注场景', // 特性3
  STARTER_FEATURE_3_TEXT_1: '专为旅行场景设计，解决特定需求，而非大而全的汇率工具', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '了解更多', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: '#scenario', // 特性3

  STARTER_FEATURE_4_TITLE_1: '多币种支持', // 特性4
  STARTER_FEATURE_4_TEXT_1: '泰国版和自定义币种版，满足不同旅行目的地需求', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '了解更多', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: '#versions', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: '源于真实旅行需求的灵感',
  STARTER_ABOUT_TEXT:
    '价格翻译官诞生于一次泰国旅行中的真实需求。当我带着父母在清迈夜市闲逛时，他们不停地问我：「这个65铢相当于多少人民币啊？」「一份快餐129铢，这个贵不贵？」<br /><br />我意识到，在国外旅行时，我们很难快速将陌生的外币价格与国内熟悉的价格体系建立联系。市面上的汇率转换工具功能强大但操作繁琐，不适合旅行场景的快速使用。',
  STARTER_ABOUT_BUTTON_TEXT: '了解开发故事',
  STARTER_ABOUT_BUTTON_URL: '#story',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '20万+',
  STARTER_ABOUT_TIPS_2: '小红书阅读量',
  STARTER_ABOUT_TIPS_3: '2万+点赞',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: '版本对比',
  STARTER_PRICING_TEXT_1: '两个版本满足不同需求',
  STARTER_PRICING_TEXT_2:
    '我们提供两个版本的价格翻译官，满足不同旅行者的需求。无论您是去泰国旅行，还是前往其他国家，都能找到适合您的版本。',

  STARTER_PRICING_1_TITLE: '泰国旅游版',
  STARTER_PRICING_1_PRICE: '0',
  STARTER_PRICING_1_PRICE_CURRENCY: '¥',
  STARTER_PRICING_1_PRICE_PERIOD: '免费',
  STARTER_PRICING_1_HEADER: 'Thai Price Translator',
  STARTER_PRICING_1_FEATURES: '泰铢到人民币转换,桌面小组件,价格参照系统,专为泰国旅行设计', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '下载iOS版',
  STARTER_PRICING_1_BUTTON_URL: 'https://apps.apple.com/app/id6749685008',

  STARTER_PRICING_2_TAG: '推荐',
  STARTER_PRICING_2_TITLE: '自定币种版',
  STARTER_PRICING_2_PRICE: '0',
  STARTER_PRICING_2_PRICE_CURRENCY: '¥',
  STARTER_PRICING_2_PRICE_PERIOD: '免费',
  STARTER_PRICING_2_HEADER: 'Price Translator',
  STARTER_PRICING_2_FEATURES: '自定义币种转换,桌面小组件,价格参照系统,适用于全球旅行', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '下载iOS版',
  STARTER_PRICING_2_BUTTON_URL: 'https://apps.apple.com/us/app/id6749051873',

  STARTER_PRICING_3_TITLE: '安卓版',
  STARTER_PRICING_3_PRICE: '0',
  STARTER_PRICING_3_PRICE_CURRENCY: '¥',
  STARTER_PRICING_3_PRICE_PERIOD: '免费',
  STARTER_PRICING_3_HEADER: 'Android版',
  STARTER_PRICING_3_FEATURES: '自定义币种转换,桌面小组件,价格参照系统,适用于安卓设备', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '下载安卓版',
  STARTER_PRICING_3_BUTTON_URL: 'https://play.google.com/store/apps/details?id=com.quickwis.pricetranslator',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: '用户评价',
  STARTER_TESTIMONIALS_TEXT_1: '旅行者们怎么说',
  STARTER_TESTIMONIALS_TEXT_2:
    '来自小红书和即刻的真实用户反馈，他们在旅行中使用价格翻译官的真实体验。',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '太实用了！在泰国旅行时一直用这个小工具，让我爸妈不再为每个价格问我换算成人民币是多少。特别是那个"约等于一杯瑞幸"的参照，太贴心了！',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '小红书用户@旅行达人',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '泰国三次游玩经验',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '这才是真正懂用户需求的产品！不是功能堆砌，而是解决了旅行中的实际痛点。桌面小组件设计太赞了，逛街时一按就知道价格合不合理。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '即刻用户@产品经理',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '关注产品设计与用户体验',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '带父母去日本旅行时用了自定义币种版，太方便了！他们终于不用每次看到价格都问我"这个贵不贵"了，自己就能判断。这个小工具真的提升了旅行体验。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '小红书用户@日本控',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '喜欢带父母出国旅行',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '从功能上看很简单，但解决了旅行中的实际问题。特别是那个价格参照功能，让我能直观理解当地物价水平。比起那些复杂的汇率转换器，这个小工具简单实用多了！',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '即刻用户@旅行爱好者',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '环球旅行中',
      STARTER_TESTIMONIALS_ITEM_URL: '#'
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: '常见问题',
  STARTER_FAQ_TEXT_1: '您可能想了解的问题',
  STARTER_FAQ_TEXT_2: '以下是用户经常问到的一些问题，如果您有其他疑问，请随时联系我们。',

  STARTER_FAQ_1_QUESTION: '价格翻译官与普通汇率转换工具有什么区别？',
  STARTER_FAQ_1_ANSWER:
    '价格翻译官专注于旅行场景，提供极简操作和直观的价格参照。普通汇率工具功能全面但操作繁琐，而我们的产品可以通过桌面小组件一键使用，并提供"约等于一杯瑞幸咖啡"这样的直观参照，帮助您快速理解当地物价。',

  STARTER_FAQ_2_QUESTION: '如何使用桌面小组件功能？',
  STARTER_FAQ_2_ANSWER:
    '下载安装后，长按手机桌面空白处，选择"小组件"，找到"价格翻译官"，添加到桌面即可。之后只需点击小组件，输入当地货币金额，即可立即看到换算结果和价格参照。',

  STARTER_FAQ_3_QUESTION: '两个版本有什么区别？我应该下载哪个？',
  STARTER_FAQ_3_ANSWER:
    '泰国旅游版(Thai Price Translator)专为泰国旅行设计，只支持泰铢到人民币的转换。自定币种版(Price Translator)支持自定义任意币种，适合去往多个国家的旅行者。如果您只去泰国旅行，推荐使用泰国版；如果您计划去多个国家，推荐使用自定币种版。',

  STARTER_FAQ_4_QUESTION: '价格参照系统是如何工作的？',
  STARTER_FAQ_4_ANSWER:
    '我们建立了一个常见商品的价格数据库，当您输入外币金额后，系统会自动匹配最接近的国内商品价格作为参照。例如，65泰铢约等于13元人民币，系统会显示"约等于一杯瑞幸咖啡"，帮助您建立直观的价格认知。',

  // 团队成员区块
  STARTER_TEAM_ENABLE: false, // 团队成员区块开关
  STARTER_TEAM_TITLE: '开发团队',
  STARTER_TEAM_TEXT_1: '独立开发者',
  STARTER_TEAM_TEXT_2:
    '价格翻译官由独立开发者在泰国旅行期间创意开发，源于真实的旅行需求。',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: 'FeiTian',
      STARTER_TEAM_ITEM_DESCRIPTION: '创始人兼开发者'
    }
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: '旅行小贴士',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: '旅行者指南',
  STARTER_BLOG_TEXT_2:
    '我们分享旅行中的实用小贴士，帮助您更好地了解目的地的物价水平和消费习惯。',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: '联系我们',
  STARTER_CONTACT_TEXT: '我们期待听到您的反馈',
  STARTER_CONTACT_LOCATION_TITLE: '关注我们',
  STARTER_CONTACT_LOCATION_TEXT: '小红书@FeiTian',
  STARTER_CONTACT_EMAIL_TITLE: '联系邮箱',
  STARTER_CONTACT_EMAIL_TEXT: 'contact@pricetranslator.app',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: '', // 基于NoteForm创建，将留言数据存在Notion中

  // 合作伙伴的图标
  STARTER_BRANDS_ENABLE: false, // 合作伙伴开关
  STARTER_BRANDS: [],

  STARTER_FOOTER_SLOGAN: '让旅行中的价格不再是谜，享受更轻松的异国购物体验。',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: '产品',
      LINK_GROUP: [
        { TITLE: '泰国旅游版', URL: 'https://apps.apple.com/app/id6749685008' },
        { TITLE: '自定币种版', URL: 'https://apps.apple.com/us/app/id6749051873' },
        { TITLE: '安卓版', URL: 'https://play.google.com/store/apps/details?id=com.quickwis.pricetranslator' },
        { TITLE: '功能介绍', URL: '#features' }
      ]
    },
    {
      TITLE: '资源',
      LINK_GROUP: [
        { TITLE: '使用指南', URL: '#guide' },
        { TITLE: '旅行小贴士', URL: '/blog' },
        { TITLE: '常见问题', URL: '#faq' },
        { TITLE: '开发故事', URL: '#story' }
      ]
    },
    {
      TITLE: '关注我们',
      LINK_GROUP: [
        { TITLE: '小红书', URL: '#xiaohongshu' },
        { TITLE: '即刻', URL: '#jike' },
        { TITLE: '微信公众号', URL: '#wechat' },
        { TITLE: '联系我们', URL: '#contact' }
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
  STARTER_CTA_TITLE: '准备好享受轻松的旅行购物体验了吗？',
  STARTER_CTA_TITLE_2: '立即下载价格翻译官',
  STARTER_CTA_DESCRIPTION:
    '告别繁琐的汇率计算，让您在国外旅行时能够轻松理解当地物价，做出明智的消费决策。',
  STARTER_CTA_BUTTON: true, // 是否显示按钮
  STARTER_CTA_BUTTON_URL: 'https://apps.apple.com/app/id6749685008',
  STARTER_CTA_BUTTON_TEXT: '免费下载',

  STARTER_POST_REDIRECT_ENABLE: false, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: '', // 重定向域名
  STARTER_NEWSLETTER: false // 是否开启邮件订阅
}
export default CONFIG