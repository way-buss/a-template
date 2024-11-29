<template>
     <div class="top">
          <div class="left">
               <div class="leftBtn" @click="goHome">首页</div>
          </div>
          <div class="center">
               <div class="centerTitle">智慧旅游可视化大数据平台</div>
          </div>
          <div class="right">
               <span class="rightBtn">统计报告</span>
               <span class="rightTime">当前时间:{{ time }}</span>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import moment from 'moment';
//获取路由对象
import { useRouter } from 'vue-router';
const $router = useRouter()
//点击首页按钮回到首页
const goHome = () => {
     $router.push('/home')
}
//存储当前时间
const time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
const timer = ref(0)
//组件挂在完毕更新当前的事件
onMounted(()=>{
     timer.value = setInterval(()=>{
          time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
     },1000)
})
//组件销毁前清除定时器
onBeforeUnmount(()=>{
     clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
     .top{
          width: 100%;
          height: 40px;
          display: flex;
          .left{
               flex: 1.5;
               background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
               background-size: cover;
               .leftBtn{
                    width: 150px;
                    height: 40px;
                    float: right;
                    background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
                    background-size: 100% 100%;
                    text-align: center;
                    line-height: 40px;
                    color: #29fcff;
                    font-size: 20px;
                    cursor: pointer;
               }
          }
          .center{
               flex: 2;
               .centerTitle{
                    width: 100%;
                    height: 74px;
                    background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
                    background-size: 100% 100%;
                    line-height: 74px;
                    text-align: center;
                    color: #29fcff;
                    font-size: 30px;
               }
          }
          .right{
               flex: 1.5;
               background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
               background-size: cover;
               display: flex;
               justify-content: space-between;
               align-items: center;
               .rightBtn{
                    width: 150px;
                    height: 40px;
                    background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
                    background-size: 100% 100%;
                    text-align: center;
                    line-height: 40px;
                    color: #29fcff;
                    font-size: 20px;
               }
               .rightTime{
                    color: #29fcff;
                    margin-right: 18px;
                    font-size: 18px;
               }
          }
     }
</style>