// // 引入项目中全部的全局组件
// import SvgIcon from './SvgIcon/index.vue'

// // 全局对象
// const allGlobalComponents = {SvgIcon}

// // 对外暴露插件对象
// export default {
//     // install 是必须的
//     install(app) {
//         Object.keys(allGlobalComponents).forEach(key => {
//             // 注册为全局组件
//             app.component(key, allGlobalComponents[key]);
//         })
//     }
// }

import SvgIcon from './SvgIcon/index.vue';
import Category from './Category/index.vue';
// 引入所有的element-plus的icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


/**
 * Plugin to register all global components
 * @param {App} app - The Vue application instance
 */

const allGlobalComponents: any = { SvgIcon, Category };

export default {
  install(app: any) {
    // 注册项目的全局组件
    Object.keys(allGlobalComponents).forEach((key: string) => {
      app.component(key, allGlobalComponents[key]);
    });
    // 注册element-plus图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
};