const InterviewConfig = {
  path: '/interview/',
  title: '前端面试题整理',
  collapsable: true, // 可选的, 默认值是 true,
  sidebarDepth: 3,    // 可选的, 默认值是 1
  children: [
    {
      title: 'shopLine',
      path: 'interview/shopLine'
    },
    {
      title: '探迹',
      path: 'interview/探迹'
    },
    {
      title: 'vip',
      path: 'interview/vip'
    },
    {
      title: '翼课网',
      path: 'interview/翼课网'
    },
    {
      title: '有米科技',
      path: 'interview/有米科技'
    },
    {
      title: 'PPMoney',
      path: 'interview/PPMoney'
    }
  ]
}
const VueCodeStudyConfig = {
  path: '/vue-code-stutdy/',
  title: 'Vue源码学习',
  collapsable: true, // 可选的, 默认值是 true,
  sidebarDepth: 3,    // 可选的, 默认值是 1
}

const LifeArticlesConfig = {
  path: '/life-articles/',
  title: '生活中的零零碎碎',
  collapsable: true, // 可选的, 默认值是 true,
  sidebarDepth: 3,    // 可选的, 默认值是 1
}

const TechNotesConfig = {
  path: '/tech-notes/',
  title: '技术笔记',
  collapsable: true, // 可选的, 默认值是 true,
  sidebarDepth: 3,    // 可选的, 默认值是 1
  children: [
    {
      title: '防抖与节流',
      path: '/tech-notes/throttle-and-debounce'
    },
    {
      title: '浏览器与Http缓存',
      path: '/tech-notes/browser-and-http-memory'
    },
  ]
}

const configArr = [
  TechNotesConfig,
  InterviewConfig,
  VueCodeStudyConfig,
  LifeArticlesConfig
]


const navAriaLabelFromConfig = (function (configArr) {
  return configArr.reduce((pre, cur) => {
    let { path: link, title: text } = cur
    return [...pre, {
      text,
      link: `${link}index`
    }]
  }, []);
})(configArr)



module.exports = {
  dest: './docs/.vuepress/dist/',
  base: '/',
  title: 'LauwXiang Blog',
  description: '前端',
  themeConfig: {
    //顶部导航栏
    nav: [
      //格式一：直接跳转，'/'为不添加路由，跳转至首页
      { text: '首页', link: '/' },

      //格式二：添加下拉菜单，link指向的文件路径
      {
        text: '分类',  //默认显示        
        ariaLabel: '分类',   //用于识别的label
        items: navAriaLabelFromConfig

      },

      //格式三：跳转至外部网页，需http/https前缀
      { text: 'Github', link: 'https://github.com/LauwXiang/' },
    ],
    // sidebar: 'auto'
    sidebar: configArr
  }
}