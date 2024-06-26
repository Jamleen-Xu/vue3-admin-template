import { defineStore } from "pinia";
import { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type.ts'
import { UserState } from "./type";
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index'
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes'
import cloneDeep from 'lodash/cloneDeep'
// 引入路由实例
import router from "@/router";

// 定义一个函数，用于过滤当前用户需要展示的异步路由
const filterAsyncRoute = (asnycRoute: any, routes: any) => {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes)  // 使用递归，将children重新赋值
            }
            return true
        }
    })
}


export const useUserStore = defineStore('User', {
    state: (): UserState => {
        // 检查是否在浏览器环境中运行
        const token = typeof window !== 'undefined' ? localStorage.getItem('TOKEN') : null;
        return {
            token: token,
            menuRoutes: constantRoute,
            username: '',
            avatar: '',
            //存储当前用户是否包含某一个按钮
            buttons: [],
        }
    },
    actions: {
        async userLogin(data: loginFormData) {
            const result: loginResponseData = await reqLogin(data);
            if (result.code === 200) {
                const token = result.data as string; // 单次类型断言
                this.token = token;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('TOKEN', token);
                }
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message || 'Login failed'));
            }
        },
        async getUserInfo() {
            const result: userInfoResponseData = await reqUserInfo();
            if (result.code === 200) {
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons = result.data.buttons;
                // 计算当前用户需要展示的异步路由，进行深拷贝，防止直接修改
                const userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute), result.data.routes);
                // 全部所需的路由整理
                this.menuRoutes = [...constantRoute, anyRoute, ...userAsyncRoute];
                //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加    
                // 可以通过router.getRoutes()获取全部路由查看
                // 路由追加
                [...userAsyncRoute, anyRoute].forEach((item: any) => {
                    router.addRoute(item)
                })
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message || 'Failed to fetch user info'));
            }
        },
        async userLogout() {
            const result = await reqLogout();
            if (result.code === 200) {
                this.token = '';
                this.username = '';
                this.avatar = '';
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('TOKEN');
                }
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message || 'Logout failed'));
            }
        }
    },
    getters: {
        // 可以添加一些getter方法，如果需要的话
    }
})