<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0px">
            <div v-show="scene === 0">
                <el-button type="primary" icon="Plus" :disabled="!attrStore.c3Id" @click="addAttr">添加属性</el-button>
                <el-table style="margin: 10px 0px" border :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="all">
                            <el-tag style="margin: 5px" v-for="item in all.row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{ row, $index }">
                            <!-- 编辑已有属性的按钮 -->
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"></el-button>
                            <el-popconfirm :title="`确定删除${row.attrName}吗?`" width="200px" @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene === 1">
                <el-card>
                    <el-form :inline="true">
                        <el-form-item label="属性名称">
                            <el-input placeholder="请输入属性名" v-model="attrParams.attrName"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" size="default" icon="Plus" @click="addAttrValue"
                        :disabled="!attrParams.attrName.trim()">添加属性值</el-button>
                    <el-button type="primary" size="default" @click="cancel">取消</el-button>
                    <!-- 表格 -->
                    <el-table border style="margin: 10px 0px" :data="attrParams.attrValueList">
                        <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                        <el-table-column label="属性值名称">
                            <template #="{ row, $index }">
                                <el-input v-if="row.flag" v-model="row.valueName" @blur="toLook(row, $index)"
                                    :ref="(vc: any) => inputArr[$index] = vc"></el-input>
                                <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="属性操作">
                            <template #="{ row, $index }">
                                <el-button type="primary" size='default'
                                    @click="() => attrParams.attrValueList.splice($index, 1)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 按钮 -->
                    <el-button type="primary" size='default' @click="save"
                        :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
                    <el-button type="primary" size='default' @click="cancel">取消</el-button>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick,onBeforeUnmount } from 'vue'
// 引入分类仓库
import useAttrStore from '@/store/modules/attr'
const attrStore = useAttrStore();
// 引入接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr';
// 引入类型
import type { AttrResponseData, AttrList, Attr, AttrValue } from '@/api/product/attr/type';
import { ElMessage } from 'element-plus';
// 存储属性和属性值
let attrArr = ref<AttrList>([])
//定义card组件内容切换变量
let scene = ref<number>(0);  // 为0的时候，展示页面；为1的时候，修改添加页面
// 收集新增属性的数据
let attrParams = reactive<Attr>({
    attrName: '', //新增属性的名字
    attrValueList: [],  // 新增属性值的数据
    categoryId: '',   // 三级分类 id
    categoryLevel: 3  // 代表三级分类
})
// 准备一个数组，存储对应的el-input组件实例
let inputArr = ref<any>([]);


//获取数据 数据展示---------------------------------------------------
// 获取属性、属性值的方法
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = attrStore;
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
    if (result.code === 200) {
        attrArr.value = result.data;
    }
}
// 监听 三级分类id 发送请求获取数据
watch(() => attrStore.c3Id, () => {
    // 清空上一次查询的数据
    attrArr.value = []
    if (!attrStore.c3Id) return
    getAttr();
})


// 添加修改属性---------------------------------------------------
// 添加属性按钮
const addAttr = () => {
    // 清空数据
    Object.assign(attrParams, {
        attrName: '', //新增属性的名字
        attrValueList: [],  // 新增属性值的数据
        categoryId: attrStore.c3Id,   // 三级分类 id 直接拿到三级分类 id
        categoryLevel: 3  // 代表三级分类
    })
    // 点击添加属性按钮的时候，场景变为1
    scene.value = 1
}
const cancel = () => {
    scene.value = 0
}
// 添加属性值按钮
const addAttrValue = () => {
    // //点击添加属性值按钮的时候,向数组添加一个属性值对象，这时候table表格才会显示行
    attrParams.attrValueList.push({ valueName: '', flag: true });

    // 点击添加按钮自动聚焦
    nextTick(() => {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}

// 保存按钮
const save = async () => {
    const result: any = await reqAddOrUpdateAttr(attrParams)
    if (result.code === 200) {
        scene.value = 0;
        ElMessage({ type: 'success', message: attrParams.id ? '修改成功' : '添加成功' })
        // 重新获取数据，更新页面
        getAttr();
    } else {
        ElMessage({ type: 'error', message: '操作失败' })
    }
}
// 编辑和查看模块的回调
const toLook = (row: AttrValue, $index: number) => {
    // 非法判断一，输入为空时
    if (row.valueName.trim() === '') {
        // 删除对应行
        attrParams.attrValueList.splice($index, 1);
        ElMessage({ type: 'error', message: '属性值不能为空' })
        return;
    }

    // 非法判断二，输入重复时

    const isRepeat = attrParams.attrValueList.find(item => {
        if (row !== item) {
            return row.valueName === item.valueName
        }
    })
    if (isRepeat) {
        // 删除重复的属性值
        attrParams.attrValueList.splice($index, 1);
        ElMessage({ type: 'error', message: '属性值不能重复' })
        return;
    }

    row.flag = false;  // 将文本框设置为展示
}
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true; // 将文本框设置为可编辑  //相应的属性值对象flag:变为true,展示input
    // 将焦点聚焦到文本框
    nextTick(() => {
        inputArr.value[$index].focus();
    })
}

// 编辑属性按钮
const updateAttr = (row: Attr) => {
    // 切换为添加与修改的页面
    scene.value = 1;
    // 将 row 已有属性 赋值给 attrParams即可
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
}
// 删除属性按钮
const deleteAttr = (id: number) => {
    reqRemoveAttr(id).then((result: any) => {
        if (result.code === 200) {
            getAttr();
            ElMessage({ type: 'success', message: '删除成功' })
        } else {
            ElMessage({ type: 'error', message: '删除失败' })
        }
    })
}
//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  attrStore.$reset()
})
</script>

<style scoped></style>