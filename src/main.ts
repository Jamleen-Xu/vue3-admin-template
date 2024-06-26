import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css';
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components'
// 引入全局样式
import '@/styles/index.scss';
// svg 插件需要配置的代码
import 'virtual:svg-icons-register'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入路由
import router from './router';
// 引入状态仓库
import pinia from './store/index.ts'

// 引入全局导航守卫
import './permission.ts'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
});
// 安装自定义组件
app.use(globalComponent)
app.use(pinia)
app.use(router)

// 引入自定义指令
import { isHasButton } from './directive/has.ts';
isHasButton(app)

app.mount('#app')
