<template>
    <div>
        <!-- 三级分类 -->
        <Category :scene="scene"></Category>
        <!-- 卡片 -->
        <el-card style="margin: 10px 0px;">
            <div v-show="scene === 0">
                <el-button type="primary" icon="Plus" @click="addSpu" :disabled="!categoryData.c3Id">添加SPU</el-button>
                <el-table border style="margin: 10px 0px" :data="recordsList">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description"></el-table-column>
                    <el-table-column label="SPU操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" icon="Plus" size="small" title="添加sku"
                                @click="addSku(row)"></el-button>
                            <el-button type="warning" icon="Edit" size="small" title="修改spu"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="info" icon="View" size="small" title="查看spu"
                                @click="showSku(row)"></el-button>
                            <el-popconfirm :title="`确定删除${row.spuName}吗？`" width="250px" @confirm="deleteSpu(row.id)">
                                <template #reference>
                                    <el-button type="danger" icon="Delete" size="small" title="删除spu"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                    @current-change="getNewSpu" @size-change="changeSize" :disabled="!categoryData.c3Id" />
            </div>
            <el-dialog v-model="show" title="sku列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <spuForm ref="spuRef" v-show="scene === 1" @changeScene="changeSceneToOne" />
            <skuForm ref="skuRef" v-show="scene === 2" @changeScene="changeSceneToOne" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import spuForm from './spuForm.vue'
import skuForm from './skuForm.vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SkuData } from '@/api/product/spu/type'
import useAttrStore from '@/store/modules/attr'
import { ElMessage } from 'element-plus'

const categoryData = useAttrStore();
let scene = ref<number>(0);   //场景切换控制
let pageNo = ref<number>(1);  //分页器默认页码
let pageSize = ref<number>(3);  //每一页展示几条数据
let recordsList = ref<Records>([]);  // 存储已有SPU数据
let total = ref<number>(0)
let spuRef = ref();  // 存储spuForm实例
let skuRef = ref();  // 存储skuForm实例
//存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)  // 控制 dialog 是否显示

watch(() => categoryData.c3Id, () => {
    // 当三级分类发生变化时，清空对应的数据
    recordsList.value = [];
    if (!categoryData.c3Id) return;   // 确保有id再发送请求。
    getSpu();

})
// 获取已有SPU数据的方法
const getSpu = async (page = 1) => {
    // 默认情况下，没有传入参数时，当前页码默认为 1
    pageNo.value = page;
    const result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryData.c3Id);
    if (result.code === 200) {
        recordsList.value = result.data.records;
        total.value = result.data.total;
    }
}
// 分页器下拉框发生变化时触发，pageSize会改变
const changeSize = () => {
    getSpu();
}
// 点击页码的时候会触发,pageNo会改变
const getNewSpu = () => {
    getSpu(pageNo.value)
}
// 添加SPU按钮的回调
const addSpu = () => {
    scene.value = 1
    spuRef.value.initAddSpu(categoryData.c3Id)
}
// 修改SPU按钮的回调
const updateSpu = (row: SpuData) => {
    scene.value = 1;
    //点击添加SPU按钮,调用子组件的方法初始化数据
    spuRef.value.initSpuFormData(row)
}

// 切换场景业务逻辑------------------------------------------------------------
const changeSceneToOne = (obj: any) => {  // 自定义事件
    //子组件Spuform点击取消变为场景0:展示已有的SPU
    scene.value = obj.flag
    if (obj.params === 'update') {
        // 留在当前页
        getSpu(pageNo.value)
    } else {
        // 添加则留在第一页
        getSpu();
    }
}

//sku-------------------------------------------------
const addSku = (row: SpuData) => {
    scene.value = 2
    skuRef.value.initSkuData(categoryData.c1Id, categoryData.c2Id, row)
}
// 查看sku
const showSku = async (row: SpuData) => {
    const result = await reqSkuList((row.id as number))
    if (result.code === 200) {
        skuArr.value = result.data
        show.value = true    // 显示对话框
    }
}
// 删除spu
const deleteSpu = async (id: number) => {
    let result = await reqRemoveSpu(id)
    if (result.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        // 重新获取数据，根据当前spu的个数，判断是否需要翻页
        getSpu(recordsList.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({ type: 'error', message: '删除失败' })
    }
}

//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
    categoryData.$reset();
})
</script>

<style scoped></style>