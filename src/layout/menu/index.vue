<template>
    <template v-for="(item, index) in menuList" :key="item.path">
        <!-- 没有子路由 -->
        <template v-if="!item.children">
            <el-menu-item v-if="!item.meta.hidden" :index="item.path" router="true" @click="goRoute">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 有且只有一个子路由 -->
        <template v-if="item.children && item.children.length === 1">
            <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path" @click="goRoute">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <!-- 有两个以上的路由 -->
        <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuList="item.children" />
        </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// 获取父组件传递过来的全部路由数据
defineProps(['menuList'])
// 获取路由对象
const $router = useRouter();

// 点击菜单的回调，路由转跳
const goRoute = (vc: any) => {
    // vc 为当前点击元素的实例
    $router.push(vc.index);
}
</script>
<!-- 使用递归组件需要进行命名操作 -->
<script lang="ts">
export default {
    name: 'Menu'
}
</script>

<style scoped>
</style>