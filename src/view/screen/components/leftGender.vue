<template>
    <div class="box1">
        <div class="title">
            <p>男女比例</p>
            <img src="../images/dataScreen-title.png" alt="">
        </div>
        <div class="gender">
            <div class="man">
                <img src="../images/man.png" alt="" />
            </div>
            <div class="women">
                <img src="../images/woman.png" alt="" />
            </div>
        </div>
        <div class="rate">
            <p>男士58%</p>
            <p>女士42%</p>
        </div>
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

    // 设置图表的配置项和数据
    mycharts.setOption({
        // 组件标题
        title: {
            // text: '11',
            textStyle: {
                // 主标题颜色
                color: 'skyblue'
            },
            left: '40%'
        },
        xAxis: {
            show: false,
            min: 0,
            max: 100,
        },
        yAxis: {
            show: false,
            type: 'category',   // 设置柱形图方向变为横向
        },
        series: [
            // // 这里有俩个柱状图，下面的覆盖上面的
            {
                type: 'bar',
                data: [58],
                barWidth: 20,
                // 柱状图的层级
                z: 100,
                // 柱状图样式
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 20,
                },

            },
            {
                type: 'bar',
                data: [100],
                //柱状图宽度
                barWidth: 20,
                // 调整女士柱形图位置
                barGap: '-100%',
                itemStyle: {
                    color: 'pink',
                    borderRadius: 20,
                },
            }
        ],
        grid: {
            left: 60,
            top: -20,
            right: 60,
            bottom: 0
        }
    })
})

</script>

<style scoped lang="scss">
.box1 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
        margin-left: 20px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .gender {
        display: flex;
        justify-content: center;

        .man {
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url(../images/man-bg.png) no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .women {
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url(../images/woman-bg.png) no-repeat;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .rate {
        display: flex;
        justify-content: center;
        color: white;

        p {
            margin: 0 40px;
            margin-top: 10px;
            margin-bottom: -10px;
        }
    }

    .charts {
        height: 100px;
    }
}
</style>