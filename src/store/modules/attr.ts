import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from "@/api/product/attr";
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { attrState } from './type'

const useAttrStore = defineStore('AttrStore', {
    state: (): attrState => {
        return {
            // 存储一级分类的数据
            c1Arr: [],
            // 存储一级分类的id
            c1Id: '',
            c2Id: '',
            c2Arr: [],
            c3Id: '',
            c3Arr: []
        }
    },
    actions: {
        // 获取一级分类数据的方法
        async getC1() {
            // 发送请求
            const result: CategoryResponseData = await reqC1()
            if (result.code === 200) {
                this.c1Arr = result.data;
            }
        },
        async getC2() {
            const result: CategoryResponseData = await reqC2(this.c1Id);
            if (result.code === 200) {
                this.c2Arr = result.data
            }
        },
        async getC3() {
            const result: CategoryResponseData = await reqC3(this.c2Id);
            if (result.code === 200) {
                this.c3Arr = result.data
            }
        }
    },
    getters: {}
})

export default useAttrStore;