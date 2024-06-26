<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
        <el-button type="primary" size="default" icon="Plus" @click="addRole">添加职位</el-button>
        <el-table border style="margin: 10px 0px" :data="allRole">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="280px" align="center">
                <!-- row:已有的职位对象 -->
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setPermission(row)">
                        分配权限
                    </el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="400" @current-change="getHasRole"
        @size-change="handleSizeChange" />
    <!-- 添加职位与更新已有职位的结构:对话框 -->
    <el-dialog v-model="dialogVisite" title="添加职位" @close="closeDialog">
        <el-form :model="roleParams" ref="formRef" :rules="rules">
            <el-form-item label="职位名称" prop="roleName">
                <el-input placeholder="请你输入职位名称" v-model="roleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="dialogVisite = false">
                取消
            </el-button>
            <el-button type="primary" size="default" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配角色</h4>
        </template>
        <template #default>
            <el-tree :data="menuArr" show-checkbox node-key="id" default-expand-all :props="defaultProps"
                :default-checked-keys="selectArr" ref="treeRef" />
        </template>
        <template #footer>
            <el-button type="primary" size="default" @click="drawer = false">取消</el-button>
            <el-button type="primary" size="default" @click="confirmClick">确定</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue"
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/api/acl/role'
import type { RoleResponseData, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

const pageNo = ref(1)
const pageSize = ref(10)
//搜索职位关键字
let keyword = ref<string>('')
let total = ref(0)
let allRole = ref<RoleData[]>([])
let settingStore = useLayOutSettingStore()
let dialogVisite = ref(false) // 控制对话框显示与隐藏
// 收集角色信息
let roleParams = reactive<RoleData>({
    roleName: '',
})
// 获取表单实例
let formRef = ref()
// 控制抽屉是否显示
let drawer = ref(false)
// 存储菜单数据
let menuArr = ref<MenuList>([])
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([])
// 定义树形组件实例
let treeRef = ref()


// 获取已有角色数据
const getHasRole = async (page = 1) => {
    //修改当前页码
    pageNo.value = page
    // 发送请求
    let result: RoleResponseData = await reqAllRoleList(
        pageNo.value,
        pageSize.value,
        keyword.value,
    )
    console.log(result)
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }
}
onMounted(() => {
    getHasRole()
})
// 搜索职位按钮
const search = () => {
    //根据关键字获取相应的用户数据
    getHasRole()
    //清空关键字
    keyword.value = ''
}
// 重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}

// 添加按钮回调
const addRole = () => {
    dialogVisite.value = true
}
// 编辑修改按钮回调
const updateRole = (row: RoleData) => {
    dialogVisite.value = true
    //存储已有的职位----带有ID的
    Object.assign(roleParams, row)

}
// 关闭对话框回调
const closeDialog = () => {
    // 统一清空上次残留的数据
    Object.assign(roleParams, {
        roleName: '',
        id: 0
    })
    // 清除验证规则
    nextTick(() => {
        formRef.value.clearValidate('roleName')
    })
}
// 表单验证规则
const validatorRoleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback();
    } else {
        callback(new Error("职位名称至少2位"));
    }
}
const rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName },],
}
// 改变每个页面的显示条数
const handleSizeChange = () => {
    getHasRole()
}
// 对话框确认按钮
const save = async () => {
    // 表单验证成功后再发送请求
    await formRef.value.validate()
    let result = await reqAddOrUpdateRole(roleParams)
    if (result.code === 200) {
        // 提示
        ElMessage({ type: 'success', message: '操作成功' })
        // 关闭对话框
        dialogVisite.value = false
        // 重新获取数据
        getHasRole(roleParams.id ? pageNo.value : 1)
    }
}


// 菜单权限部分----------------------------------
// 分配角色按钮
const setPermission = async (row: RoleData) => {
    drawer.value = true
    // 存储当前角色信息
    Object.assign(roleParams, row)
    // 发送请求获取数据
    let result: MenuResponseData = await reqAllMenuList((roleParams.id as number))
    if (result.code == 200) {
        menuArr.value = result.data;
        // 获取到数据后，需要展示已经勾选的数据，要对数据进行过滤。原理：根据第四级数据的checked进行过滤
        selectArr.value = filterSelectArr(menuArr.value, [])
    }
}
// 过滤角色数据的方法，使用递归实现
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level === 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}
// el-tree的prop绑定的对象，
const defaultProps = {
    //子树为节点对象的children
    children: 'children',
    //节点标签为节点对象的name属性
    label: 'name',
}

// 抽屉确认按钮
const confirmClick = async () => {
    // 请求需要两个参数，第一个是点击角色的ID,第二个selectArr选中的节点的数组
    //职位的ID
    const roleId = roleParams.id as number
    //选中节点的ID
    let arr = treeRef.value.getCheckedKeys()
    //半选的ID
    let arr1 = treeRef.value.getHalfCheckedKeys()
    let permissionId = arr.concat(arr1)
    // 发送请求
    let result: any = await reqSetPermisstion(roleId, permissionId)
    if (result.code == 200) {
        // 关闭抽屉
        drawer.value = false
        ElMessage({ type: 'success', message: '操作成功' })
        // 页面刷新
        window.location.reload();
    }
}

// 删除已有的职位
const removeRole = async (id: number) => {
    let result = await reqRemoveRole(id)
    if (result.code ===200) {
        // 提示信息
        ElMessage({ type: 'success', message: '删除成功' })
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

const test = () => {
    console.log(111)
}
</script>

<style scoped></style>