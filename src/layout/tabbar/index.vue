<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <!-- 左侧静态 -->
            <el-icon style="margin-right: 10px" @click="changeIconSetting">
                <component :is="settingStore.fold ? Fold : Expand" />
            </el-icon>
            <!-- 左侧的面包屑 -->
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item) in $route.matched" :key="item.path" v-show="item.meta.title"
                    :to="item.path">{{ item.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabbar_right">
            <!-- 右侧静态 -->
            <el-button :icon="Refresh" size="small" circle @click="refresh" />
            <el-button :icon="FullScreen" size="small" circle @click="fullScreen" />
            <!-- 气泡卡片 -->
            <el-popover placement="top-start" title="设置" :width="200" trigger="hover">
                <template #reference>
                    <el-button :icon="Setting" size="small" circle />
                </template>
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker @change="setColor" v-model="color" :predefine="predefineColors" show-alpha
                            size="small" :teleported="false"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch v-model="dark" class="mt-2" style="margin-left: 24px" inline-prompt
                            :active-icon="Check" :inactive-icon="Close" @change="changeDark" />
                    </el-form-item>
                </el-form>
            </el-popover>
            <img :src="avatar" style="width: 24px; height: 24px; border-radius: 50%;" />
            <!-- 下拉菜单 -->
            <el-dropdown style="margin-right: 7px">
                <span>
                    {{ username }}
                    <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
// 获取路由信息
import { useRoute, useRouter } from 'vue-router'
const $route = useRoute();
const $router = useRouter();

// 导入图标
import { ArrowRight, Setting, FullScreen, Refresh, Fold, Expand, Check, Close } from '@element-plus/icons-vue';
// 从store获取一个响应式数据控制图标切换
import useLayoutSettingStore from '@/store/modules/setting';
const settingStore = useLayoutSettingStore();
// 菜单的折叠和展开
const changeIconSetting = () => {
    settingStore.changeFold();
}
// 控制页面刷新按钮
const refresh = () => {
    settingStore.refresh = true;
}
// 全屏点击
const fullScreen = () => {
    // DOM对象的一个属性，可以用来判断当前是不是全屏模式【全屏：true，不是全屏：false】
    let full = document.fullscreenElement;

    // 切换为全屏模式
    if (!full) {
        // 文档根节点的方法 requestFullscreen，实现全屏模式
        document.documentElement.requestFullscreen();
    } else {
        // 退出全屏模式
        document.exitFullscreen();
    }
}
// 从 store 获取用户信息
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const username = computed(() => userStore.username)
const avatar = computed(() => userStore.avatar)

// 退出登录
const logout = async () => {
    // 第一件事：向服务器发送请求(退出登录接口,高数服务器，本次登录的Token无效了)，这里没有故不需要
    // 第二件事：清除本地存储的token，用户信息
    // 第三件事：转跳到向到登录页
    // 还要实现一个功能，退出登录到login页面后，再次点击登陆，会回到之前退出登录的页面
    // 我们可以通过传递路由的query来实现
    await userStore.userLogout();
    $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 暗黑模式，主题颜色---------------------
let dark = ref(false);
const changeDark = () => {
    //获取HTML根节点
    let html = document.documentElement
    //判断HTML标签是否有类名dark
    dark.value ? (html.className = 'dark') : (html.className = '');
}

// 主题颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
const setColor = () => {
    //通知js修改根节点的样式对象的属性与属性值
    const html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    /* background-image: linear-gradient(to right, #0acffe 0%, #495aff 100%, #0acffe 0%); */
    background-image: linear-gradient(to right, #0acffe, #495aff, #0acffe);

    .tabbar_left {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .tabbar_right {
        display: flex;
        align-items: center;

        img {
            width: 25px;
            height: 25px;
            margin: 0 10px 0 10px;
        }
    }
}
</style>
