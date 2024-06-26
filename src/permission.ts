// 路由鉴权：
import router from "@/router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({showSpinner: false});  // 关闭右上角加载的图标

// 获取用户相关的小仓库内部的token
import { useUserStore } from '@/store/modules/user'
import pinia from "./store";
let userStore = useUserStore(pinia);

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next) => {
    document.title = `模板-${to.meta.title}`
    // to: 即将要进入的目标 路由对象
    // from: 从哪个路由而来
    // next: 放行函数
    NProgress.start();
    let token = userStore.token;
    let username = userStore.username;

    // 判断用户是否登录
    if (token) {
        // 用户登录了，不能访问login页面------------
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            // 登录成功后访问其余的路由，确保其余路由都有用户信息
            // 有用户信息
            if (username) {
                next();
            } else {
                // 没有用户信息，发请求获取用户信息
                try {
                    await userStore.getUserInfo();
                    //万一刷新的时候是异步路由，有可能获取到用户信息但是异步路由没有加载完毕，出现空白效果
                    next({...to});
                } catch (error) {
                    // 无法获取用户信息 --> token 失效 用户手动处理Token
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        // 用户没有登录---------
        if (to.path === '/login') {
            next();
        } else {
            // 如果用户访问的不是login那就跳转到login，我们也可以添加query参数，让用户登录成功后，
            // 就可以直接访问我们想访问的页面
            next({ path: '/login', query: { redirect: to.path } });
        }
    }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
    NProgress.done();
})