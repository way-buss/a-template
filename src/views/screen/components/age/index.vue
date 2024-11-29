<template>
  <div class="a_box">
    <div class="a_title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="a_charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取 charts dom
const charts = ref()
//组件挂载完毕和初始化图标图形
onMounted(() => {
  const mycharts = echarts.init(charts.value)
  //设置配置项
  const option = {
    color: ['#987fcc', '#ecc25d', '#eb832c', '#138997', '#0d54a5', '#7ec2ea'],
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 40,
      right: 20,
      orient: 'vertical', //图例组件方向的设置
      textStyle: {
        color: 'white',
        fontStyle: 14,
      },
    },
    series: [
      {
        name: '年龄比例',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 26, name: '10岁以下' },
          { value: 18, name: '10-18岁' },
          { value: 18, name: '18-30岁' },
          { value: 40, name: '30-40岁' },
          { value: 20, name: '40-60岁' },
          { value: 20, name: '60岁以上' },
        ],
      },
    ],
    //调整图形图标位置
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  mycharts.setOption(option)
})
</script>
<style scoped lang="scss">
.a_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .a_title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .a_charts {
    height: 230px;
  }
}
</style>
