<template>
  <div class="i_box">
    <div class="i_title">
      <p>未来7天游客量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取 dom
const line = ref()
onMounted(() => {
  const mycharts = echarts.init(line.value)
  //设置配置项
  mycharts.setOption({
    // x|y 轴
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //分割线
      splitLine: {
        show: false,
      },
      data:['周一','周二','周三','周四','周五','周六','周日'],
    },
    yAxis: {
      //分割线
      splitLine: {
        show: false,
      },
      //轴线的设置
      axisLine:{
          show:true,
      },
      //刻度
      axisTick:{
          show:true,
      }
    },
    grid: {
      top: 30,
      bottom: 40,
      left: 46,
      right: 10,
    },
    //系列
    series: [
      {
        type: 'line',
        data: [113, 888, 198, 1888, 369, 1188, 666],
        //平滑曲线设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#675a4c', // color at 0%
              },
              {
                offset: 1,
                color: '#333556', // color at 100%
              },
            ],
            global: false, // default is false
          },
        },
      },
    ],
  })
})
</script>
<style scoped lang="scss">
.i_box {
  width: 96%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
  .i_title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
