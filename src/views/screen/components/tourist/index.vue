<template>
  <div class="tourist_container">
    <div class="tc_top">
      <p class="tc_title">实时游客统计</p>
      <p class="tc_bg"></p>
      <p class="tc_right">
        可预约总量
        <span>9999</span>
        人
      </p>
    </div>
    <div class="tc_number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 展示 echarts 图形图标节点的盒子 -->
    <div class="tc_charts" ref="charts">111</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const people = ref('8888人')
//引入 echarts
import * as echarts from 'echarts'
//echarts 水球图拓展插件
import 'echarts-liquidfill'
//获取 charts 的实例
const charts = ref()
//挂载完毕
onMounted(() => {
  const mycharts = echarts.init(charts.value)
  mycharts.setOption({
    //系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill', //系列
      data: [0.6, 0.4, 0.2], //展示的数据
      radius: '70%', //半径
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'yellowgreen',
          borderColor: '#294D99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)',
        },
      },
    },
  })
})
</script>
<style scoped lang="scss">
.tourist_container {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .tc_top {
    margin-left: 20px;
    .tc_title {
      color: white;
      font-size: 20px;
    }
    .tc_bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .tc_right {
      float: right;
      color: white;
      font-size: 18px;
      span {
        color: yellowgreen;
      }
    }
  }
  .tc_number {
    display: flex;
    margin-top: 60px;
    padding: 0 20px;
    span {
      flex: 1;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #29fcff;
      font-size: 24px;
      font-weight: 800;
    }
  }
  .tc_charts {
    width: 100%;
    height: 270px;
    margin-top: 10px;
  }
}
</style>
