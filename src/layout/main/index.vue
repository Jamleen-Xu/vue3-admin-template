<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由的子路由 -->
            <component :is="Component"  v-if="flag"/>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import {watch, ref, nextTick} from 'vue';
import  useLayoutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayoutSettingStore();

// 控制当前组件是否销毁重建
let flag = ref(true);

// 监听数据仓库数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(() => layoutSettingStore.refresh, () => {
    flag.value = false;
    // 更新完页面、数据后调用
    nextTick(() => {
        flag.value = true;
        layoutSettingStore.refresh = false;
    })
})

</script>

<style scoped>
.fade-enter {
    opacity: 0;
    transition: translateX(-1000px);
}
.fade-enter-active {
    transition: all 1s;
}
.fade-leave-active {
    opacity: 1;
    transition: translateX(0);
}
</style>
