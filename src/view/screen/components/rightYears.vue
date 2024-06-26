<template>
    <div class="box7">
        <div class="title">
            <p>年度游客量对比</p>
            <img src="../images/dataScreen-title.png" alt="" />
        </div>
        <!-- 图形图标的容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//获取DOM节点
let charts = ref()

onMounted(() => {
    let mycharts = echarts.init(charts.value)

    // 设置配置项
    mycharts.setOption({
        title: {
            text: '散点图',
            textStyle: {
                color: 'white',
            },
            left: '42%'
        },
        xAxis: {
            type: 'category',
        },
        yAxis: {
            // 分割线不要
            splitLine: { show: false },
        },
        series: [
            {
                type: 'scatter',
                // 设置散点图的数据
                data: [5, 20, 36, 10, 10, 20, 21, 65, 86, 52, 67, 73, 54, 24, 76, 98],
                // 点，标记的形状
                symbol: 'diamond',
                // 标记的大小
                symbolSize: 20,
                label: {
                    show: true,
                    position: 'top',
                    color: 'white'
                },
                // 标记的颜色
                itemStyle: {
                    color: 'skyblue'
                }
            }
        ],
        grid: {
            left: 40,
            bottom: 40,
        }
    })
})


</script>

<style lang="scss" scoped>
.box7 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 5px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    }
}
</style>