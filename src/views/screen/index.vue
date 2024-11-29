<template>
     <div class="container">
          <div class="screen" ref="screen">
               <!-- 数据大屏顶部 -->
               <div class="top">
                    <Top></Top>
               </div>
               <div class="bottom">
                    <div class="left">
                         <Tourist class="left_tourist"></Tourist>
                         <Sex class="left_sex"></Sex>
                         <Age class="left_age"></Age>
                    </div>
                    <div class="center">
                         <Map class="map"></Map>
                         <Line class="line"></Line>
                    </div>
                    <div class="right">
                         <Rank class="rank"></Rank>
                         <Year class="year"></Year>
                         <Couter class="count"></Couter>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
//引入顶部的子组件
import Top from './components/top/index.vue';
//引入底部左侧三个子组件
import Tourist from './components/tourist/index.vue';
import Age from './components/age/index.vue';
import Sex from './components/sex/index.vue';
//引入中间两个子组件
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';
//引入右侧三个子组件
import Rank from './components/rank/index.vue';
import Year from './components/year/index.vue';
import Couter from './components/couter/index.vue';
//获取数据大屏展示内容盒子的 dom 元素
const screen = ref()
//加载完毕
onMounted(() => {
     screen.value.style.transform=`scale(${getScale()}) translate(-50%, -50%)`
})
//定义大屏缩放比例
function getScale(w=1920,h=1080){
     const ww = window.innerWidth/w
     const wh = window.innerHeight/h
     return ww<wh?ww:wh
}
//监听视口变化
window.onresize = () => {
     screen.value.style.transform=`scale(${getScale()}) translate(-50%, -50%)`
}
</script>
<style scoped lang="scss">
.container{
     width: 100vw;
     height: 100vh;
     background: url(./images/bg.png) no-repeat;
     background-size: cover;
     .screen{
          position: fixed;
          width: 1920px;
          height: 1080px;
          transform-origin: left top;
          left: 50%;
          top: 50%;
          .top{
               width: 100%;
               height: 40px;
          }
          .bottom{
               display: flex;
               .left{
                    flex: 1.1;
                    height: 1040px;
                    display: flex;
                    flex-direction: column;
                    margin-left: 44px;
                    .left_tourist{
                         flex: 1.5;
                    }
                    .left_sex{
                         flex: 1;    
                    }
                    .left_age{
                         flex: 1;
                    }
               }
               .center{
                    flex: 2.3;
                    display: flex;
                    flex-direction: column;
                    .map{
                         flex: 3;
                    }
                    .line{
                         flex: 1;
                    }
               }
               .right{
                    flex: 1.1;
                    margin-right: 44px;
                    display: flex;
                    flex-direction: column;
                    .rank{
                         flex: 1.5;
                    }
                    .year{
                         flex: 1;
                    }
                    .count{
                         flex: 1;
                    }
               }
          }
     }
}
</style>