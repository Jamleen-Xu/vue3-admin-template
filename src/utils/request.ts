import axios from "axios";
import { ElMessage } from "element-plus";
// 获取用户相关的仓库
import { useUserStore } from '@/store/modules/user'

let service = axios.create({
    // 基础路径
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000,  // 超时的时间间隔
})

// 添加请求、响应拦截器
service.interceptors.request.use((config) => {
    // 获取用户相关的小仓库，获取仓库内部的Token，登录成功后携带给服务器
    let userStore = useUserStore();
    if (userStore.token) {
        config.headers.token = userStore.token;
    }   

    // 返回配置对象
    return config
})

service.interceptors.response.use((response) => {
    // 成功回调

    return response.data
}, (error) => {
    console.log(error)
    // 失败回调，处理http网络错误的
    let message = ''; // 存储错误信息
    // let status = error.response.status;  // 状态码
    // switch (status) {
    //     case 401:
    //         message = 'Token过期'
    //         break;
    //     case 403:
    //         message = '拒绝访问'
    //         break;
    //     case 500:
    //         message = '服务器内部错误'
    //         break;
    //     default:
    //         message = '请求失败'
    //         break;
    // }
    // 提示错误信息
    ElMessage({
        type: 'error',
        message
    });
    return Promise.reject(error);
})

export default service;