<template>
  <div class="s_box">
    <div class="s_title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="s_sex">
      <div class="s_man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="s_women">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="s_rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="s_charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取 charts 实例
const charts = ref()
onMounted(() => {
  //初始化 echarts 实例
  const mycharts = echarts.init(charts.value)
  //设置配置项
  mycharts.setOption({
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth:20,
        z:100,
        itemStyle:{
          color:'#007afe',
          borderRadius:20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth:20,
        //调整女士柱条位置
        barGap:'-100%',
        itemStyle:{
          color:'#ff4b7a',
          borderRadius:20
        }
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>
<style scoped lang="scss">
.s_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0;
  .s_title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .s_sex {
    display: flex;
    justify-content: center;
    .s_man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .s_women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .s_rate {
    display: flex;
    justify-content: space-between;
    color: white;
    margin-left: 20%;
    width: 60%;
  }
  .s_charts {
    height: 100px;
    width: 60%;
    margin-left: 20%;
  }
}
</style>
