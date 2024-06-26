<template>
    <div class="container">
        <!-- 数据大屏展示内容区域 -->
        <div class="screen" ref="screen">
            <div class="top">
                <Top />
            </div>
            <div class="bottom">
                <div class="left">
                    <leftTourist class="tourist" />
                    <leftGender class="gender" />
                    <leftAge class="age" />
                </div>
                <div class="center">
                    <centerMap class="map" />
                    <centerLine class="line" />
                </div>
                <div class="right">
                    <rightRank class="rank" />
                    <rightCouter class="couter" />
                    <rightYears class="years" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/Top.vue';     // 引入顶部组件
import leftAge from './components/leftAge.vue';
import leftGender from './components/leftGender.vue';
import leftTourist from './components/leftTourist.vue';
import centerMap from './components/centerMap.vue';
import centerLine from './components/centerLine.vue';
import rightRank from './components/rightRank.vue'
import rightCouter from './components/rightCouter.vue'
import rightYears from './components/rightYears.vue'

let screen = ref()  // screen容器实例

//定义大屏缩放比例
const getScale = (w = 1920, h = 1080) => {
    let ww = window.innerWidth / w;
    let hh = window.innerHeight / h;
    return hh < ww ? hh : ww;
}

// 监听屏幕缩放
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
}

onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
</script>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;

        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .bottom {
            display: flex;

            .right {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 40px;

                .rank {
                    flex: 1.2;
                }

                .couter {
                    flex: 1;
                }

                .years {
                    flex: 1;
                }
            }

            .left {
                flex: 1;
                height: 1040px;
                display: flex;
                flex-direction: column;

                .tourist {
                    flex: 1.2;
                }

                .gender {
                    flex: 1;
                }

                .age {
                    flex: 1;
                }
            }

            .center {
                flex: 1.5;
                display: flex;
                flex-direction: column;

                .map {
                    flex: 3;
                }

                .line {
                    flex: 1.3;
                }
            }
        }
    }
}
</style>