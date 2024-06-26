// 定义小仓库的数据类型
import type { RouteRecordRaw } from "vue-router"
import type { CategoryObj } from '@/api/product/attr/type'

export interface UserState {
    token: string | null,
    menuRoutes: RouteRecordRaw[],
    username: string,
    avatar: string,
    //存储当前用户是否包含某一个按钮
    buttons: string[],
}

// 定义分类仓库state对象的类型
export interface attrState {
    c1Id: number | string,
    c1Arr: CategoryObj[],
    c2Id: number | string,
    c2Arr: CategoryObj[],
    c3Id: number | string,
    c3Arr: CategoryObj[]
}