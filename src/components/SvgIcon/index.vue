<template>
    <div>
        <h1>svg测试</h1>
        <svg :style="{ width, height }">
            <use :xlink:href="prefix + name" fill="red"></use>
        </svg>
    </div>
</template>

<script setup lang="ts">
// 接收父组件传递过来的参数
defineProps({
    // xlink:href属性值的前缀
    prefix: {
        type: String,
        default: '#icon-'
    },
    // icon名称
    name: String,
    color: {
        type: String,
        default: ''
    },
    // 接收传递过来的图标大小
    width: {
        type: String,
        default: '36px'
    },
    height: {
        type: String,
        default: '36px'
    }
})
</script>

<style scoped lang="scss">
</style>