<template>
    <div class="box7">
        <div class="title">
            <p>热门景区排行</p>
            <img src="../images/dataScreen-title.png" alt="" />
        </div>
        <!-- 图形图标的容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, nextTick } from 'vue'
//获取DOM节点
let charts = ref()

type EChartsOption = echarts.EChartsOption;

onMounted(() => {
    nextTick(() => {
        let mycharts = echarts.init(charts.value)

        let option: EChartsOption;;
        const data: number[] = [];
        for (let i = 0; i < 5; ++i) {
            data.push(Math.round(Math.random() * 200));
        }

        option = {
            xAxis: {
                max: 'dataMax'
                // 文字样式
            },
            yAxis: {
                type: 'category',
                data: ['A', 'B', 'C', 'D', 'E'],
                inverse: true,  // 是否是反向坐标轴。
                animationDuration: 300,
                animationDurationUpdate: 300,
                max: 2
            },
            series: [
                {
                    realtimeSort: true,  // 是否开启实时排序，用来实现动态排序图效果，
                    name: 'X',  // 系列名称
                    type: 'bar',
                    data: data,
                    label: {
                        color: 'white',
                        show: true,
                        position: 'right',
                        valueAnimation: true  // 是否开启动画
                    }
                }
            ],
            // 图例组件。
            legend: {
                show: true,
            },
            animationDuration: 0,
            animationDurationUpdate: 3000,
            animationEasing: 'linear',
            animationEasingUpdate: 'linear'
        }

        function run() {
            for (var i = 0; i < data.length; ++i) {
                if (Math.random() > 0.9) {
                    data[i] += Math.round(Math.random() * 2000);
                } else {
                    data[i] += Math.round(Math.random() * 200);
                }
            }

            mycharts.setOption({
                series: [
                    {
                        type: 'bar',
                        data
                    }
                ]
            });
        }

        setTimeout(function () {
            run();
        }, 0);
        setInterval(function () {
            run();
        }, 3000);

        option && mycharts.setOption(option);
    });
})
</script>

<style lang="scss" scoped>
.box7 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;

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