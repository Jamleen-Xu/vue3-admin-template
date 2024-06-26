<template>
    <el-card>
        <el-form :inline="true" class="demo-form-inline" :disabled="scene === 0 ? false : true">
            <el-form-item label="一级分类">
                <el-select v-model="attrStore.c1Id" @change="getCategory2">
                    <el-option 
                        v-for="c1 in attrStore.c1Arr"
                        :key="c1.id"
                        :label="c1.name"
                        :value="c1.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="attrStore.c2Id" @change="getCategory3">
                    <el-option 
                        v-for="c2 in attrStore.c2Arr"
                        :key="c2.id"
                        :label="c2.name"
                        :value="c2.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="attrStore.c3Id">
                    <el-option
                        v-for="c3 in attrStore.c3Arr"
                        :key="c3.id"
                        :label="c3.name"
                        :value="c3.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// 接收prop
defineProps(['scene'])
// 引入分类仓库
import useAttrStore from '@/store/modules/attr'
const attrStore = useAttrStore();

// 获取一级分类数据的方法
const getC1 = () => {
    attrStore.getC1()
}
// 组件挂载完成时使用
onMounted(() => {
    getC1();
})

// 一级分类的change事件,选中值的时候会触发,保证一级分类ID有了
const getCategory2 = () => {
    // 因为 c2id c3arr c3id为上一次选择时的值，我们需要清除，c2arr为最新值
    attrStore.c2Id = '';
    // attrStore.c3Arr = [];
    attrStore.c3Id = '';
    attrStore.getC2();
}
// 二级分类的change事件,选中值的时候会触发,保证二级分类ID有了
const getCategory3 = () => {
    attrStore.c3Id = '';
    attrStore.getC3();
}

</script>


<style>
.demo-form-inline .el-select {
    --el-select-width: 180px; /* Adjusted width */
}
</style>