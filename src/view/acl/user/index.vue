<template>
    <el-card style="height: 80px;">
        <el-form :inline="true">
            <el-form-item label="用户名:">
                <el-input placeholder="请输入用户名" v-model="keyword" </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card style="margin: 10px 0;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="!userArr.length" @click="batchDelete">批量删除</el-button>
        <!-- table展示用户信息 -->
        <el-table style="margin: 10px 0;" :data="userArr" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button @click="updateUser(row)" size="small" icon="Edit">编辑</el-button>
                    <el-popconfirm :title="`确定删除${row.username}吗？`" width="250px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasUser" @size-change="getHasUser(1)" />
    </el-card>
    <!-- 弹出抽屉，用于添加和更新用户 -->
    <el-drawer v-model="drawer">
        <!-- 头部标题:将来文字内容应该动态的 -->
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <!-- 身体部分 -->
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉,分配用户角色 -->
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <!-- 显示职位的的复选框 -->
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role" :value="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button type="primary" size="default" @click="confirmClick">保存</el-button>
            <el-button type="primary" size="default" @click="() => drawer1 = false">取消</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
import type { CheckboxValueType } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'

//获取模板setting仓库
let settingStore = useLayOutSettingStore()
let pageNo = ref(1)  // 当前页
let pageSize = ref(3)  // 每一页展示几条数据
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
// 抽屉控制变量
let drawer = ref<boolean>(false)
//收集用户信息的响应式数据
let userParams = reactive<User>({
    id: 0,
    username: '',
    name: '',
    password: '',
})
//获取form组件实例
let formRef = ref<any>()
// 控制分配角色抽屉是否显示----------------------
let drawer1 = ref<boolean>(false)
//收集顶部复选框全选数据, 
let checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
let isIndeterminate = ref<boolean>(true)
//存储全部职位的数据 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
let allRole = ref<AllRole>([])
//当前用户已有的职位
const userRole = ref<any[]>([]);
// 当前选择用户
let selectArr = ref()
// 定义响应式数据，收集用户输入进来的关键字
let keyword = ref<string>('')


onMounted(() => {
    getHasUser()
})
// 获取用户信息的方法
const getHasUser = async (page = 1) => {
    pageNo.value = page
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
    if (result.code === 200) {
        total.value = result.data.total
        userArr.value = result.data.records
    }
}

// 保存按钮
const save = async () => {
    //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
    await formRef.value.validate()
    console.log(userParams)
    //保存按钮:添加新的用户|更新已有的用户账号信息
    let result: any = await reqAddOrUpdateUser(userParams)
    console.log(result)
    //添加或者更新成功
    if (result.code === 200) {
        // 关闭抽屉
        drawer.value = false
        ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功', })
        //获取最新的全部账号的信息
        getHasUser(userParams.id ? pageNo.value : 1)
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        //关闭抽屉
        drawer.value = false
        //提示消息
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败',
        })
    }
}

// 添加用户按钮
const addUser = () => {
    // 抽屉显示出来
    drawer.value = true;
    // 添加按钮时，将上次残余清空
    Object.assign(userParams, { username: '', name: '', password: '' })
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
// 添加页面中的取消按钮
const cancel = () => {
    drawer.value = false;
}

//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
//校验用户名字回调函数
const validatorName = (rule: any, value: string, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
const validatorPassword = (rule: any, value: string, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 6) {
        callBack()
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
// 验证规则
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
// 编辑更新用户按钮
const updateUser = (row: User) => {
    drawer.value = true;
    //存储收集已有的账号信息
    Object.assign(userParams, row)
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('password')
    })
}


// 分配角色部分------------------------
const setRole = async (row: User) => {
    // 存储已有的用户属性
    Object.assign(userParams, row)
    //获取全部的职位的数据与当前用户已有的职位的数据
    let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
    if (result.code === 200) {
        // 存储全部的职位
        allRole.value = result.data.allRolesList
        //存储当前用户已有的职位
        
        userRole.value = result.data.assignRoles
        //抽屉显示出来
        drawer1.value = true
    }
}

const handleCheckAllChange = (value: CheckboxValueType) => {
    userRole.value = value ? allRole.value : [];
    //不确定的样式(确定样式)  ，该样式只有在全选或全不选的情况下才不会出现，部分选择时会出现
    isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
    // 参数为选中的按钮， 进行全等比较判断是否为全选
    checkAll.value = value.length === allRole.value.length
    //不确定的样式
    isIndeterminate.value = value.length !== allRole.value.length
}
// 分配角色的确认按钮
const confirmClick = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: userParams.id as number,
        roleIdList: userRole.value.map((item: any) => {
            return item.id as number
        }),
    }
    //分配用户的职位
    let result: any = await reqSetUserRole(data)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '分配职务成功' })
        //关闭抽屉
        drawer1.value = false
        //获取更新完毕用户的信息,更新完毕留在当前页
        getHasUser(pageNo.value)
    }
}

// 删除用户按钮
const deleteUser = async (userId: number) => {
    let result: any = await reqRemoveUser(userId)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// 批量删除用户按钮
const batchDelete = async () => {
    //整理批量删除的参数
    let idsList: any = selectArr.value.map((item: any) => {
        return item.id
    })
    //批量删除的请求
    let result: any = await reqSelectUser(idsList)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// 表格的selection-change事件，获取选中的数据
const handleSelectionChange = (value: any) => {
    selectArr.value = value
}
// 搜索按钮
const search = () => {
    //根据关键字获取相应的用户数据
    getHasUser();
    //清空关键字
    keyword.value = ''
}
//重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
    // 在之前已实现，通过 v-if ，销毁创建组件， main组件中通过监听 refresh 的变化，控制 flag布尔值的变化，实现页面的创建销毁。
}
</script>

<style scoped></style>