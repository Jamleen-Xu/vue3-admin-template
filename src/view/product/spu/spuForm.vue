<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请你输入SPU名称" v-model="spuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="spuParams.tmId">
                <el-option v-for="item in myAllTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请你输入SPU描述" v-model="spuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload list-type="picture-card" v-model:file-list="imgList" action="/api/admin/product/fileUpload"
                :on-preview="handlePictureCardPreview" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full alt="Preview Image" :src="dialogImageUrl" style="width: 100%; height: 100%" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性" size="default">
            <!-- 展示销售属性的下拉菜单 -->
            <el-select v-model="saleAttrIdAndAttrName">
                <el-option v-for="item in unSelectSaleAttr" :key="item.id" :value="`${item.id}:${item.name}`"
                    :label="item.name"></el-option>
            </el-select>
            <el-button style="margin-top: 10px" type="primary" size="default" icon="Plus" @click="addSaleAttr">
                添加属性
            </el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table border style="margin: 10px 0px" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <!-- row:即为当前SPU已有的销售属性对象 -->
                    <template #="{ row, $index }">
                        <el-tag v-for="item in row.spuSaleAttrValueList" :key="item.id" style="margin: 0px 5px"
                            @close="row.spuSaleAttrValueList.splice($index, 1)">
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input v-model="row.saleAttrValue" v-if="row.flag === true" placeholder="请输入属性值" size="small"
                            style="width: 100px" @blur="toLook(row)"></el-input>
                        <el-button v-else type="primary" size="small" icon="Plus" @click="toEdit(row)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="default" @click="save" :disable="!spuParams.spuName">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {
    SpuData, AllTradeMark, SpuHasImg, HasSaleAttrResponseData, SaleAttrResponseData,
    Trademark, SpuImg, SaleAttr, HasSaleAttr, SaleAttrValue
} from '@/api/product/spu/type'
import { reqAllTradeMark, reqSpuImageList, reqAllSaleAttr, reqSpuHasSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import { ref, computed } from 'vue'
import { ElMessage } from "element-plus"

const $emit = defineEmits(['changeScene'])
// 存储已有的spu这些数据
let myAllTradeMark = ref<Trademark[]>([]);    // 所有的spu品牌
let imgList = ref<any>([]);   // 商品图片
let saleAttr = ref<SaleAttr[]>([]);   // 存储已有的spu销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);  // 全部的销售属性
// 定义一个存储已有spu的对象
let spuParams = ref<SpuData>({
    category3Id: '',
    spuName: '',
    tmId: '',
    description: '',
    spuImageList: null,
    spuSaleAttrList: null,
})
//控制对话框的显示与隐藏------该对话框用来展示预览图片。
let dialogVisible = ref<boolean>(false)
//存储预览图片地址
let dialogImageUrl = ref<string>('')
// 添加属性下拉菜单 收集的数据
let saleAttrIdAndAttrName = ref<string>('');  // 收集销售属性id和销售属性值



const cancel = () => {
    $emit('changeScene', {flag: 0})
}
// 对外暴露的方法，在父组件中调用，子组件这里发送请求获取数据
const initSpuFormData = async (spudata: SpuData) => {
    //spudata:即为父组件传递过来的已有的SPU对象[不完整]
    //获取全部品牌的数据
    spuParams.value = spudata;  // 直接赋值给收集参数的对象
    let result1: AllTradeMark = await reqAllTradeMark();
    //获取某一个品牌旗下全部售卖商品的图片
    let result2: SpuHasImg = await reqSpuImageList(spudata.id as number)
    //获取已有的SPU销售属性的数据
    let result3: SaleAttrResponseData = await reqSpuHasSaleAttr(spudata.id as number)
    //获取整个项目全部SPU的销售属性
    let result4: HasSaleAttrResponseData = await reqAllSaleAttr()

    // 存储全部品牌的数据
    myAllTradeMark.value = result1.data
    // 存储某一个品牌旗下全部售卖商品的图片
    imgList.value = result2.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    // 存储已有的SPU销售属性的数据
    saleAttr.value = result3.data
    // 存储整个项目全部SPU的销售属性
    allSaleAttr.value = result4.data
}

// //照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true;
}
// 上传前的钩子，我们用来对数据做预处理
const handlerUpload = (file: any) => {
    if (
        file.type == 'image/png' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/gif'
    ) {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M',
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF',
        })
        return false
    }
}

// 属性数据收集--------------------------------
//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value.filter(item => {    // 返回符合要求的数据的数组
        return saleAttr.value.every(item1 => {
            return item.name !== item1.saleAttrName   // 返回布尔值
        })
    })
    return unSelectArr
})
// 添加属性按钮回调
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndAttrName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttr.value.push(newSaleAttr)
    saleAttrIdAndAttrName.value = ''
}
// 属性值添加与删除----------------------
// 属性值添加按钮，将按钮切换为输入框
const toEdit = (row: SaleAttr) => {
    row.flag = true;
    row.saleAttrValue = ''
}
// 输入框失去焦点的回调blur
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //  //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue as string
    }
    // 进行非法输入判断
    if ((saleAttrValue as string).trim() === '') {
        ElMessage({ type: 'error', message: '属性值不能为空!' });
        return;
    }
    // 判断属性值是否重复
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrName === saleAttrValue
    })
    if (repeat) {
        ElMessage({ type: 'error', message: '属性值不能重复!' });
        return;
    }

    // 追加到属性的属性值数组中
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    // 切换为查看模式
    row.flag = false;
}

// 保存按钮--更新spu
const save = async () => {
    // 整理参数
    spuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {  // 将imgList中的数据整理成服务器需要的数据，因为图片墙的时候改过数据
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })

    //2:整理销售属性的数据
    spuParams.value.spuSaleAttrList = saleAttr.value

    // 发送请求
    let result = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code === 200) {
        ElMessage({ type: 'success', message: spuParams.value.id ? '修改成功!' : '添加成功!' })

        // 通知父组件切换页面
        $emit('changeScene', {flag: 0, params: spuParams.value.id ? 'update': 'add'})
    } else {
        ElMessage({ type: 'error', message: spuParams.value.id ? '修改失败!' : '添加失败!' })
    }
}


// 添加 新spu的方法，对外暴露，父组件调用-----------------------
const initAddSpu = async (c3Id: number | string) => {
    //清空数据
    Object.assign(spuParams.value, {
        category3Id: '', //收集三级分类的ID
        spuName: '', //SPU的名字
        description: '', //SPU的描述
        tmId: '', //品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    })
    //清空照片
    imgList.value = []
    //清空销售属性
    saleAttr.value = []
    saleAttrIdAndAttrName.value = ''
    // 存储三级分类id
    spuParams.value.category3Id = c3Id;
    // 获取全部品牌、属性的数据
    let result1 = await reqAllTradeMark();
    let result2 = await reqAllSaleAttr();
    // 存储数据
    myAllTradeMark.value = result1.data
    allSaleAttr.value = result2.data
}
defineExpose({ initSpuFormData, initAddSpu })
</script>
