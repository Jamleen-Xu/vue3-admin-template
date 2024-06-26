<template>
    <el-card class="box-card">
        <el-button type="primary" icon="Plus" @click="addTradeMark">添加商品</el-button>
        <!-- 
            table
                ---border:是否有纵向的边框
                ---stripe:是否为斑马纹
                table-column
                ---lable：某一个列表
                ---width：设置这一列的宽度
                 ---align：设置这一列对齐方式
         -->
        <el-table :data="trademarkArr" style="margin: 10px" stripe border>
            <el-table-column label="序号" width="80" align="center" type="index" />
            <el-table-column prop="tmName" label="商品名称" />
            <!-- 要显示图片，需要用作用域插槽 -->
            <el-table-column label="商品LOGO">
                <template #="{ row, $index }">
                    <img :src="row.logoUrl" style="width: 80px; height: 80px" />
                </template>
            </el-table-column>
            <el-table-column label="商品操作">
                <template #="{ row, $index }">
                    <el-button type="warning" icon="Edit" size="small" @click="updateTradeMark(row)">修改</el-button>
                    <!-- 气泡框确认组件 -->
                    <el-popconfirm title="确定删除吗？" width="250px" icon="Delete" @confirm="deleteTradeMark(row.id)">
                        <template #reference>
                            <el-button type="danger" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!-- 
                pagination
                ---v-model:current-page：设置当前分页器页码
                ---v-model:page-size:设置每一页展示数据条数
                ---page-sizes：每页显示个数选择器的选项设置，下拉显示的条数
                ---background:背景颜色
                 ---layout：分页器6个子组件布局的调整 "->"把后面的子组件顶到右侧
     -->
        <el-pagination @size-change="sizeChange" @current-change="getBaseTradeMark" v-model:current-page="pageNo"
            v-model:page-size="limit" :pager-count="9" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper,->, sizes, total" :total="total" />
        <!-- 对话框dialog，用于修改和添加使用 -->
        <el-dialog v-model="dialogFormVisible" :itle="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" prop="tmName">
                    <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称" />
                </el-form-item>
                <el-form-item label="品牌LOGO" prop="logoUrl">
                    <!-- action发送请求路径要带 api ，因为配置了代理，代理处使用了api，发送前会去掉的 -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="cancel">取消</el-button>
                    <el-button type="primary" @click="confirm"> 确定</el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts" name="trademark">
//引入组合式API函数
import { ref, onMounted, reactive, nextTick } from 'vue'
// 引入获取已有品牌数据的接口
import { reqBaseTradeMark, reqAddOrUpdateTradeMark, reqDeleteTradeMark } from '@/api/product/trademark'
// 引入类型
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type'
// 引入element-plus相关的
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
//当前页码
let pageNo = ref<number>(1)
//每一页展示的数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框是否显示
let dialogFormVisible = ref<boolean>(false);
//定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({ tmName: '', logoUrl: '' })
// 表单form实例
let formRef = ref();


// 将获取品牌的接口封装成一个函数，任何情况下想要获取数据，调用函数即可-------------------
// 分页器当前页码发生变化时会触发，并且会传入所点击的 页数
//  因为limit和pageNo是双向绑定的，  分页器相关的数据也会随之改变
const getBaseTradeMark = async (page = 1) => {
    pageNo.value = page;
    let result: TradeMarkResponseData = await reqBaseTradeMark(pageNo.value, limit.value);
    if (result.code === 200) {
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }
}
// 组件挂在完成时，调用一次接口
onMounted(() => {
    getBaseTradeMark();
});
// 分页器下拉菜单发生变化时会触发，该分页器组件会将下拉菜单中选中的数据返回
// 还要实现一个效果，当我们选中下拉菜单中的数据时，要使得当前页码归一，
const sizeChange = () => {
    getBaseTradeMark();
}


// dialog对话框的逻辑------------------------------------
// 添加品牌函数
const addTradeMark = () => {

    dialogFormVisible.value = true
    //清空收集数据
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''
    // 清除表单校验信息
    // formRef.value?.clearValidate('tmName');
    nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
}
// 修改品牌函数
const updateTradeMark = (row: TradeMark) => {
    nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
    dialogFormVisible.value = true
    // 合并对象
    Object.assign(trademarkParams, row)
}
// 取消按钮的逻辑
const cancel = () => {
    dialogFormVisible.value = false
}
// 确定按钮的逻辑
const confirm = async () => {
    await formRef.value.validate();  // 验证通过在执行后续逻辑，失败后不执行后续逻辑

    let result: any = await reqAddOrUpdateTradeMark(trademarkParams);
    console.log(result)
    if (result.code === 200) {
        // 关闭对话框
        dialogFormVisible.value = false
        // 弹出对话信息
        ElMessage({
            type: 'success',
            message: '操作成功！'
        })
        // 重新获取数据
        getBaseTradeMark(trademarkParams.id ? pageNo.value : 1)
    } else {
        // 添加品牌失败
        ElMessage({
            type: 'error',
            message: '操作失败！'
        })
        dialogFormVisible.value = false;
    }
}
// 上传成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    trademarkParams.logoUrl = response.data;
    formRef.value.clearValidate('logoUrl');  // 清除表单校验信息
}
// 上传前回调，验证
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('文件要求为图片！')
        return false
    } else if (rawFile.size / 1024 / 1024 > 4) {
        ElMessage.error('文件大小不能超过4MB！')
        return false
    }
    return true
}
// 表单验证
// 自定义规则 rule 规则对象，value 表单项的值，callback 放行函数
const validatorTmName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback();
    } else {
        callback(new Error("品牌名称至少2位"));
    }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {  // value为图片地址
    if (value) {
        // 如果有路径，图片上传
        callback();
    } else {
        callback(new Error("请上传图片"));
    }
}
const rules = {
    tmName: [{ required: true, trigger: 'blur', validator: validatorTmName },],
    logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
// 删除品牌
const deleteTradeMark = async (id: number) => {
    const result = await reqDeleteTradeMark(id);
    if (result.code === 200) {
        // 删除成功提示信息
        ElMessage({ type: 'success', message: '删除成功！' })
        // 重新获取数据
        if (pageNo.value === 1) {
            getBaseTradeMark();
        } else {
            getBaseTradeMark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
        }
    } else {
        // 删除失败提示信息
        ElMessage({ type: 'error', message: '删除失败！' })
    }
}
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>