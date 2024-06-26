<template>
    <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px;" border row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="权限" prop="code"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作">
            <template #="{ row, $index }">
                <el-button type="primary" size="small" :disabled="row.level == 4 ? true : false"
                    @click="addPermisstion(row)">
                    {{ row.level == 3 ? '添加功能' : '添加菜单' }}
                </el-button>
                <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false"
                    @click="updatePermisstion(row)">编辑</el-button>
                <el-popconfirm :title="`你确定要删除${row.name}?`" width="260px" @confirm="removeMenu(row.id)">
                    <template #reference>
                        <el-button type="primary" size="small" :disabled="row.level == 1 ? true : false">
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
    <el-dialog v-model="dialogVisible">
        <!-- 表单组件:收集新增与已有的菜单的数据 -->
        <el-form>
            <el-form-item label="名称">
                <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限">
                <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import type { PermisstionResponseData, PermisstionList, MenuParams, Permisstion } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus';


//存储菜单的数据
let PermisstionArr = ref<PermisstionList>([])
let dialogVisible = ref<boolean>(false)  //控制对话框显示与隐藏
//携带的参数，添加和修改的参数
let menuData = reactive<MenuParams>({
    code: '',
    level: 0,
    name: '',
    pid: 0,
})


onMounted(() => {
    getHasPermisstion()
})
// 获取菜单的方法
const getHasPermisstion = async () => {
    let result: PermisstionResponseData = await reqAllPermisstion()
    if (result.code === 200) {
        PermisstionArr.value = result.data

    }
}

// 对话框的确认按钮
const save = async () => {
    //发请求:新增子菜单|更新某一个已有的菜单的数据
    let result: any = await reqAddOrUpdateMenu(menuData)
    if (result.code === 200) {
        //对话框隐藏
        dialogVisible.value = false
        //提示信息
        ElMessage({
            type: 'success',
            message: menuData.id ? '更新成功' : '添加成功',
        })
        //再次获取全部最新的菜单的数据
        getHasPermisstion()
    }
}

const addPermisstion = (row: Permisstion) => {
    // 先清空参数
    Object.assign(menuData, {
        id: 0,
        code: '',
        level: 0,
        name: '',
        pid: 0,
    })
    // 弹出对话框
    dialogVisible.value = true
    // //收集新增的菜单的level数值，因为添加时我们点击的是父级节点给子节点新增，所以level要+1
    menuData.level = row.level + 1
    // //收集新增的菜单的pid数值，因为添加时我们点击的是父级节点给子节点新增，所以pid要+1
    menuData.pid = row.id as number
}

// 编辑按钮
const updatePermisstion = (row: Permisstion) => {
    dialogVisible.value = true
    //点击修改按钮:收集已有的菜单的数据进行更新
    Object.assign(menuData, row)
}

// 删除按钮
const removeMenu = async (id: number) => {
    let result = await reqRemoveMenu(id)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasPermisstion()
    }
}

</script>

<style scoped></style>