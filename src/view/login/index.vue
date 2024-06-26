<template>
    <div class="login_cons">
        <el-row>
            <!-- 可以使用响应式设计 :xs -->
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="elform" :model="formInfo" :rules="rules" ref="formRef">
                    <img class="mihayou" src="../../assets/image/mihayou.png" />
                    <h1>登陆</h1>
                    <!-- 账户名 -->
                    <el-form-item class="elform-item" prop="username">
                        <el-input type="text" :prefix-icon="User" v-model="formInfo.username" />
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item class="elform-item" prop="password">
                        <el-input type="password" v-model="formInfo.password" :show-password="true"
                            :prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item class="elform-item">
                        <el-button type="primary" class="el_btn" @click="login" :loading="loading">
                            登陆
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
// 转跳路由
import { useRouter, useRoute } from 'vue-router';
const $router = useRouter();
const $route = useRoute();

// element-plus 相关组件、样式
import { User, Lock } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';

// 引入状态仓库
import { useUserStore } from '@/store/modules/user.ts';
const useStore = useUserStore();

// 转跳时间
import { getTime } from '@/utils/time'
// 获取form ref ----表单验证（即）通过才发送请求登录，才弹窗
const formRef = ref();

// 表单数据
const formInfo = reactive({
    username: '',
    password: '',
});
// 登录按钮loading样式，加载效果
const loading = ref(false)

// 登录按钮回调
const login = async () => {
    // 点击按钮后通知仓库发送请求
    // 请求成功->跳转到首页；请求失败->弹出登录失败的信息

    await formRef.value.validate();  // 返回promise，状态为fulfilled后才执行以下操作
    // el-form 上的属性，判断检验是否通过，通过后才发送请求。

    loading.value = true;  // 显示loading效果
    useStore.userLogin(formInfo)
        .then(() => {
            // 编程式导航转跳到首页
            const redirect: any = $route.query.redirect;
            $router.push({path: redirect || '/'});
            // 提示消息框
            ElNotification({
                type: 'success',
                message: '登陆成功',
                title: `欢迎回来！${getTime()}好`,
            })
        })
        .catch((error) => {
            // 登陆失败
            loading.value = false;
            ElNotification({
                type: 'error',
                message: (error as Error).message
            })
        })
}

// 自定义验证，函数
const validateUserName = (_: any, value: any, callback: any) => {
    // rule 为验证规则对象
    // value 为表单元素文本内容
    // callback为函数，进行放行操作，若验证不通过，可传入 Error 对象
    if (/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
        callback();
    } else {
        callback(new Error('用户名长度为4-16位， 包含字母、数字、下划线'));
    }
}

// 验证规则
const rules = {
    username: [
        // { required: true, message: '用户名不能为空', trigger: 'blur' },
        // { min: 3, max: 10, message: '用户名长度在3-10位字符', trigger: 'blur' },
        { trigger: 'change', validator: validateUserName }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度在8-16位', trigger: 'blur' },
    ],
}

</script>

<style scoped lang="scss">
.login_cons {
    width: 100%;
    height: 100vh;
    background: url('@/assets/image/yuan.jpg') no-repeat;
    background-size: cover;

    .elform {
        position: relative;
        width: 60%;
        height: 350px;
        top: 22vh;
        // background: url('@/assets/image/loginbar.webp') no-repeat;
        background-color: #fff;
        border-radius: 12px;
        background-size: cover;

        .elform-item {
            width: 90%;
            margin-left: 18px;
            margin-bottom: 30px;
        }

        h1 {
            color: blue;
            font-size: 20px;
            text-align: center;
            margin-bottom: 20px;
        }

        .mihayou {
            margin: 20px 0;
            padding-left: 120px;
            width: 100px;
        }

        .el_btn {
            width: 100%;
        }
    }
}
</style>