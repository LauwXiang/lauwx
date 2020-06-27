module.exports = {
  dest: './docs/.vuepress/dist/',
  base: '/',
  title: 'LauwXiang Blog',
  description: '前端',
  themeConfig: {
    // sidebar: 'auto'
    sidebar: [
      {
        title: '前端面试题整理',
        path: '/interview/',
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
      },
      {
        title: 'vue底层源码学习',
        path: '/vue-code-stutdy/',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 3,    // 可选的, 默认值是 1
      }

    ]
  }
}