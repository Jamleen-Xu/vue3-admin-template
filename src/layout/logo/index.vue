<template>
    <div class="logo" v-if="setting.logoHide">
        <img class="img" :src="setting.logo">
        <p>{{ setting.title }}</p>
    </div>
</template>

<script setup lang="ts">
// 引入设置标题与logo的配置文件
import setting from '@/setting'

</script>

<style scoped lang="scss">
.logo {
    box-sizing: border-box;
    width: 100%;
    height: $base-menu-logo-height;
    color: #959ea6;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: $base-menu-logo-fontSize;
    background-color: $base-menu-background;
    padding: 20px;

    .img {
        width: 40px;
        height: 40px;
    }

    p {
        font-size: $base-menu-logo-fontSize;
        margin: 5px 8px 0 10px;
    }
}
</style>