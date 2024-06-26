<template>
    <div class="box4" ref="map">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//获取DOM元素
let map = ref()
//引入中国地图的JSON数据
import chinaJSON from './china.json'

// 注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
    let mychart = echarts.init(map.value)
    // 设置配置项
    mychart.setOption({
        // 地图组件
        geo: {
            map: 'china',
            roam: true,  // 是否开启鼠标缩放和平移漫游
            zoom: 1.3,   // 控制地图的放大缩小
            top: 200,
            // 地图上文字的设置
            label: {
                show: true,
                color: '#000',
                fontSize: 12
            },
            itemStyle: {
                // 每一个多边形的样式
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    // 这个是渐变的颜色
                    colorStops: [
                        {
                            offset: 0,
                            color: '#00F6FF' // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: '#0040FF' // 100% 处的颜色
                        },
                    ],
                    global: false, // 缺省为 false
                },
                opacity: 1,
            },
            // 地图高亮效果，选中时的样式
            emphasis: {
                itemStyle: {
                    color: '#00F6FF',
                },
                label: {
                    fontSize: 20
                }
            }
        },
        series: [
            {
                type: 'lines',  // 航线
                data: [
                    {
                        coords: [
                            [108.320004, 22.82402],  // 起点
                            [103.823557, 36.058039]   // 终点
                        ],
                        // 样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        }
                    },
                    {
                        coords: [
                            [91.132212, 29.660361], // 起点
                            [100.132212, 25.660361], // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        },
                    },
                    {
                        coords: [
                            [100.132212, 25.660361], // 起点
                            [109.132212, 18.660361], // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        },
                    },
                    {
                        coords: [
                            [109.132212, 18.660361], // 起点
                            [117.132212, 25.660361], // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        },
                    },
                    {
                        coords: [
                            [112.304436, 37.618179], // 起点
                            [106.504962, 29.533155], // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        },
                    },
                    {
                        coords: [
                            [101.778916, 36.623178],
                            [87.617733, 43.792818],
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'red',
                            width: 2,
                        },
                    },
                ],
                // 动画特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'yellow',
                    symbolSize: 10,
                }
            }
        ],
    })
})

</script>

<style scoped lang="scss"></style>