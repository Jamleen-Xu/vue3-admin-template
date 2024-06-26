<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{ fold: layoutSetting ? true : false }" >
            <Logo class="logo"></Logo>
            <!-- 菜单目录展示 -->
            <!-- 目录滚动 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单 -->
                <el-menu 
                    background-color="#001529" 
                    text-color="white" class="el-menu" 
                    :default-active="route.path" 
                    :collapse="layoutSetting ? true : false"
                >
                    <Menu :menuList='userStore.menuRoutes' />
                </el-menu>
            </el-scrollbar>

        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ fold: layoutSetting ? true : false }">
            <Tabbar />
        </div>
        <!-- 内容展示区 -->
        <div class="layout_main" :class="{ fold: layoutSetting ? true : false }">
            <Main />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// 引入路由属性
import { useRoute } from 'vue-router';
const route = useRoute();
// 左侧logo图标子组件
import Logo from './logo/index.vue';
// 引入主体内容main
import Main from './main/index.vue';
// 引入顶部tabbar组件
import Tabbar from './tabbar/index.vue';
// 引入pinia状态仓库
import { useUserStore } from '@/store/modules/user.ts'
const userStore = useUserStore();
// 引入menu组件
import Menu from './menu/index.vue';
// 获取折叠、展开菜单的状态
import useLayoutSettingStore from '@/store/modules/setting.ts';
const layoutSettingStore = useLayoutSettingStore();  // 使用类名操控折叠菜单
const layoutSetting = computed(() => layoutSettingStore.fold);  // 使用计算属性防止丢失响应式
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100%;
}

.layout_slider {
    width: $base-menu-width;
    height: 100%;
    background-color: #001529;
    transition: all .3s;

    .logo {
        padding: 10px;
    }

    .scrollbar {
        height: calc(100% - $base-menu-logo-height);

        .el-menu {
            border: none;;
        }
    }

    &.fold {
        width: $base-menu-min-width;
    }
}

.layout_tabbar {
    position: fixed;
    height: $base-bar-height;
    width: calc(100% - $base-menu-width);
    top: 0px;
    transition: all .3s;
    left: $base-menu-width;

    &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
    }
}

.layout_main {
    position: absolute;
    top: $base-bar-height;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-bar-height);
    left: $base-menu-width;
    padding: 20px;
    overflow: auto;
    transition: all .3s;

    &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
    }
}
</style>