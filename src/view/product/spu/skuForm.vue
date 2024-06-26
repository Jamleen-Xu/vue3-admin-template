<template>
    <el-form>
        <el-form-item label="sku名称">
            <el-input placeholder="请输入sku名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdValueId">
                        <el-option v-for="item1 in item.attrValueList" :key="item1.id" :label="item1.valueName"
                            :value="`${item.id}:${item1.id}`"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item size="default" v-for="item in saleArr" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option v-for="item1 in item.spuSaleAttrValueList" :key="item1.id"
                            :label="item1.saleAttrValueName" :value="`${item.id}:${item1.id}`"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称" size="default">
            <el-table border :data="imgArr" ref="tableRef">
                <el-table-column type="selection" width="88px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px">
                    </template>
                </el-table-column>
                <el-table-column label="图片名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" @click="setDefault(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqSpuHasSaleAttr, reqSpuImageList, reqAddSku } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let emit = defineEmits(['changeScene'])   // 自定义事件
let attrArr = ref<any>([])  // 存储平台属性
let saleArr = ref<any>([])  // 存储销售属性
let imgArr = ref<any>([]) // 获取照片墙的数据
let skuParams = reactive<SkuData>({
    category3Id: '', //三级分类的ID
    spuId: '', //已有的SPU的ID
    tmId: '', //SPU品牌的ID
    skuName: '', //sku名字
    price: '', //sku价格
    weight: '', //sku重量
    skuDesc: '', //sku的描述
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '' //sku图片地址
})

let tableRef = ref<any>()


// 取消按钮
const cancel = () => {
    emit('changeScene', { flag: 0, params: '' })
}
// 初始化数据的方法-获取数据
const initSkuData = async (c1Id: number | string, c2Id: number | string, row: any) => {
    //收集数据
    skuParams.category3Id = row.category3Id
    skuParams.spuId = row.id
    skuParams.tmId = row.tmId
    // 获取平台属性
    let result1: any = await reqAttr(c1Id, c2Id, row.category3Id)
    // 获取对应的销售属性
    let result2: any = await reqSpuHasSaleAttr(row.id)
    // 获取照片墙的属性
    let result3: any = await reqSpuImageList(row.id)

    // 存储数据
    attrArr.value = result1.data
    saleArr.value = result2.data
    imgArr.value = result3.data
}

// //设置默认图片的方法回调
const setDefault = (row: any) => {
    // 因为只能选择一个图片，所以点击设置默认前先把其他图片选框清空
    // tableRef.value.clearSelection();
    // 另一种方法
    imgArr.value.forEach((item: any) => {
        tableRef.value.toggleRowSelection(item, false);
    })
    // 设置默认图片
    tableRef.value.toggleRowSelection(row, true);
    // 收集图片数据
    skuParams.skuDefaultImg = row.imgUrl;
}

// 保存按钮回调
const save = async () => {
    // 整理参数
    // 平台参数
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdValueId) {
            let [attrId, valueId] = next.attrIdValueId.split(':')
            prev.push({ attrId, valueId })
        }
        return prev
    }, []);  // 将初始值设置为空数组，prev就是上一次的数组。

    // 销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
            prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
    }, [])

    //添加SKU的请求
    let result: any = await reqAddSku(skuParams)
    console.log(result)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加SKU成功',
        })
        //通知父组件切换场景为零
        emit('changeScene', { flag: 0, params: '' })
    } else {
        ElMessage({
            type: 'error',
            message: '添加SKU失败',
        })
    }
}
// 对外暴露，在父组件中调用
defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>