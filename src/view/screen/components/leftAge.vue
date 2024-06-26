<template>
    <div class="box2">
        <div class="title">
            <p>年龄比例</p>
            <img src="../images/dataScreen-title.png" alt="" />
        </div>
        <!-- 图形图标的容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

//获取图形图标的DOM节点
let charts = ref()

onMounted(() => {
    // 初始化echarts实例
    let mycharts = echarts.init(charts.value)

    // 配置项
    const option = {
        // 提示框组件。
        tooltip: {
            trigger: 'item'
        },
        // 图例组件。饼形图旁边的图例
        legend: {
            right: 30,
            top: 80,
            orient: 'vertical', //图例组件方向的设置
            textStyle: {
                color: 'white',
                fontSize: 14,
            },
        },
        series: [
            {
                name: '年龄比例',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center',
                    color: 'white',
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 15, name: '0-15' },
                    { value: 35, name: '15-30' },
                    { value: 30, name: '30-50' },
                    { value: 15, name: '50-75' },
                    { value: 5, name: '75-100' }
                ]
            }
        ],
    };
    // 设置图表的配置项和数据
    mycharts.setOption(option)

})

</script>

<style scoped lang="scss">
.box2 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 20px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: 260px;
    }
}
</style>