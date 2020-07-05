const fs = require('fs')
const readDir = fs.readdirSync('./')
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
			title: 'javascript常用函数封装',
			path: '/tech-notes/javascript常用函数封装'
		},
		{
			title: '浏览器与Http缓存',
			path: '/tech-notes/browser-and-http-memory'
		},
		{
			title: '关于图片的奇奇怪怪知识点，常用10大图片js库',
			path: '/tech-notes/image-base-js'
		}
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
	},
	plugins: [
		[
			'vuepress-plugin-helper-live2d', {
				// 是否开启控制台日志打印(default: false)
				log: false,
				live2d: {
					// 是否启用(关闭请设置为false)(default: true)
					enable: true,
					// 模型名称(default: hibiki)>>>取值请参考：
					// https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
					model: 'miku',
					display: {
						position: "right", // 显示位置：left/right(default: 'right')
						width: 180, // 模型的长度(default: 135)
						height: 400, // 模型的高度(default: 300)
						hOffset: 65, //  水平偏移(default: 65)
						vOffset: 0, //  垂直偏移(default: 0)
					},
					mobile: {
						show: true // 是否在移动设备上显示(default: false)
					},
					react: {
						opacity: 0.9 // 模型透明度(default: 0.8)
					}
				}
			}
		]
	]
}