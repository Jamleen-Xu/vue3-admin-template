<template>
    <el-card>
        <el-table border style="margin: 10px 0;" :data="skuArr" >
            <el-table-column type="index" label="序号" width="80px"></el-table-column>
            <el-table-column label="名称" prop="skuName" width="80px" show-overflow-tooltip></el-table-column>
            <el-table-column label="描述" prop="skuDesc" width="300px" show-overflow-tooltip></el-table-column>
            <el-table-column label="图片" width="300px">
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
                </template>
            </el-table-column>
            <el-table-column label="重量" prop="weight" width="300px"></el-table-column>
            <el-table-column label="价格" prop="price" width="300px"></el-table-column>
            <el-table-column label="操作" width="300px" fixed="right">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" :icon="row.isSale ? 'Bottom' : 'Top'"
                        @click="updateSale(row)"></el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
                    <el-button type="primary" size="small" icon="InfoFilled" @click="showSku(row)"></el-button>
                    <el-popconfirm :title="`确定删除${row.skuName}吗？`" width="250px" @confirm="deleteSku(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper, ->,sizes,total " :total="400"
            @current-change="getHasSku" @size-change="handler" />

        <!-- 展示商品详情 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>商品详情</h4>
            </template>
            <template #default>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">重量</el-col>
                    <el-col :span="18">{{ skuInfo.weight }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin: 5px;" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.attrName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag style="margin: 5px;" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%" />
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqDeleteSku } from '@/api/product/sku/'
import { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus';

const pageNo = ref(1)
const pageSize = ref(10)  //每一页展示几条数据
let total = ref<number>(0)   // 存储总条数
let skuArr = ref<SkuData[]>([]) // 存储已有sku数据
let drawer = ref<boolean>(false)// 控制抽屉是否显示
let skuInfo = ref<any>({})  // 存储sku详情

// 获取已有sku数据
const getHasSku = async (page = 1) => {
    pageNo.value = page
    let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
    if (result.code === 200) {
        total.value = result.data.total
        skuArr.value = result.data.records
    }
}
// 挂载时获取sku数据
onMounted(() => {
    getHasSku()
})
// 分页器下拉菜单
const handler = () => {
    getHasSku()
}

// 上下架
const updateSale = async (row: SkuData) => {
    //如果当前商品的isSale==1,说明当前商品是上架的额状态->更新为下架
    if (row.isSale) {
        // 下架操作
        reqCancelSale(row.id as number)
        ElMessage({ type: 'success', message: '下架成功' })
        //发请求获取当前更新完毕的全部已有的SKU
        getHasSku(pageNo.value)
    } else {
        // 上架操作
        reqSaleSku(row.id as number)
        ElMessage({ type: 'success', message: '上架成功' })
        //发请求获取当前更新完毕的全部已有的SKU
        getHasSku(pageNo.value)
    }
}

// 修改
const updateSku = () => {
    ElMessage({ type: 'success', message: '程序员在努力的更新中....' })
}

// 查看
const showSku = async(row: SkuData) => {
    drawer.value = true
    drawer.value = true
    //获取已有商品详情数据
    let result: SkuInfoData = await reqSkuInfo(row.id as number)
    // 存储已有sku详情数据
    skuInfo.value = result.data;
}
// 删除sku
const deleteSku = async(id: number) => {
    let result:any = await reqDeleteSku(id);
    if (result.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage({ type: 'error', message: '删除失败' })
    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>