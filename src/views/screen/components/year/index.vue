<template>
  <div class="y_box">
    <div class="y_title">
      <p>年度游客量</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取 charts 实例
const charts = ref()
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图表
  const mychart = echarts.init(charts.value)
  //设置配置项
  mychart.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white',
      },
    },
    //x|y
    xAxis: {
      type: 'category', //图形图表在x轴均匀分布
      show: true,
    },
    yAxis: {
      show: false,
    },
    //布局组件
    grid: {
      left: 20,
      top: 50,
      bottom: 30,
      right: 20,
    },
    //系列：决定显示图形图表是哪一种
    series: {
      type: 'scatter',
      data: [
        [3.4, 4.5, 15, 43],
        [4.2, 2.3, 20, 91],
        [10.8, 9.5, 30, 18],
        [7.2, 6.8, 18, 57],
        [40.4, 8.8, 18.8, 88.8],
        [40.4, 11.8, 18.8, 88.8],
      ],
      //标记图形设置
      symbol: 'diamond',
      //图文标签
      label: {
        show: true,
        position: 'top',
      },
      //散点图标记的颜色
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#02468d', // color at 0%
            },
            {
              offset: 1,
              color: '#022861', // color at 100%
            },
          ],
          global: false, // default is false
        },
      },
    },
  })
})
</script>
<style scoped lang="scss">
.y_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .y_title {
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
