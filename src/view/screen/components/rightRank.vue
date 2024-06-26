<template>
    <div class="box6">
        <div class="title">
            <p>热门景区排行</p>
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
    //一个容器可以同时展示多种类型的图形图标
    let mychart = echarts.init(charts.value)

    // 设置配置项
    mychart.setOption({
        title: {
            text: '景区热度排行',
            // 主标题样式
            textStyle: {
                color: 'yellowgreen',
                fontSize: 20
            },
            left: '40%',  // 设置文字位置
            link: 'https://www.baidu.com', // 可以添加链接
            // 子标题
            subtext: '热度排行榜',
            subtextStyle: {
                color: 'yellowgreen',
                fontSize: 16,
            }
        },
        xAxis: {
            type: 'category', // 设置为类目轴
            data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆'],
        },
        yAxis: {},
        series: [
            {
                type: 'bar',
                data: [10, 20, 30, 40, 50, 60, 70],
                //柱状图的:图形上的文本标签
                label: {
                    show: true,
                    // 文字的位置
                    position: 'insideTop',

                },
                //是否显示背景颜色
                // showBackground: true,
                // 背景颜色
                // backgroundStyle: {
                //     //底部背景的颜色
                //     color: {
                //         type: 'linear',
                //         x: 0,
                //         y: 0,
                //         x2: 0,
                //         y2: 1,
                //         colorStops: [
                //             {
                //                 offset: 0,
                //                 color: 'black', // 0% 处的颜色
                //             },
                //             {
                //                 offset: 1,
                //                 color: 'blue', // 100% 处的颜色
                //             },
                //         ],
                //         global: false, // 缺省为 false
                //     },
                // },
                // 柱条样式
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                    // 颜色
                    color: function (data: any) {
                        //给每一个柱条这是背景颜色
                        let arr = [
                            'red',
                            'orange',
                            'yellowgreen',
                            'green',
                            'purple',
                            'hotpink',
                            'skyblue',
                        ]
                        return arr[data.dataIndex]
                    }
                }

            },
            // 再添加一个折线
            {
                type: 'line',
                data: [10, 20, 30, 40, 50, 60, 70],
                // 平滑曲线的设置
                smooth: true,
            }
        ],
        grid: {
            left: 30,
            bottom: 20,
            right: 20,
        },
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.7)',
        }
    })
})

</script>

<style scoped lang="scss">
.box6 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

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