import request from "@/utils/request.ts";
import type { TradeMarkResponseData, TradeMark } from './type'

enum API {
    //获取已有品牌接口
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    // 添加品牌接口
    TRADEMARK_ADD_URL = '/admin/product/baseTrademark/save',
    // 修改品牌接口
    TRADEMARK_UPDATE_URL = '/admin/product/baseTrademark/update',
    // 删除品牌接口
    TRADEMARK_DELETE_URL = '/admin/product/baseTrademark/remove/'
}

// 获取已有品牌的接口
//page:获取第几页 ---默认第一页
//limit:获取几个已有品牌的数据
export const reqBaseTradeMark = (page: number, limit: number) => {
    return request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)
}

// 添加与修改已有品牌的方法
export const reqAddOrUpdateTradeMark = (data: TradeMark) => {
    // 修改已有数据
    if (data.id) {
        return request.put<any, any>(API.TRADEMARK_UPDATE_URL, data)
    } else {
        // 添加新数据
        return request.post<any, any>(API.TRADEMARK_ADD_URL, data)
    }
}

// 删除品牌
export const reqDeleteTradeMark = (id: number) => {
    return request.delete<any, any>(API.TRADEMARK_DELETE_URL + id)
}