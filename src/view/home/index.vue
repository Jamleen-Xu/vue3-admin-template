<template>
    <el-card>
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar" />
            <div class="bottom">
                <h3 class="title">{{ getTime() }}好呀{{ userStore.username }}</h3>
                <p class="subtitle">vue3-admin-template</p>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time';
// 引入用户相关仓库，获取当前用户头像，昵称
import { useUserStore } from '@/store/modules/user.ts';

let userStore = useUserStore();


</script>

<style scoped lang="scss">
.box {
    display: flex;

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .bottom {
        margin-left: 20px;

        .title {
            font-size: 30px;
            font-weight: 900;
            margin-bottom: 30px;
        }

        .subtitle {
            font-style: italic;
            color: skyblue;
        }
    }
}

</style>
