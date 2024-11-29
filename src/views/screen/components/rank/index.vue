<template>
  <div class="r_box">
    <div class="r_title">
      <p>景区排行</p>
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
    //标题组件
    title: {
      //主标题
      text: '景区排行',
      link: 'http://www.baidu.com',
      //标题的位置
      left: '50%',
      //主标题文字样式
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
      //子标题
      subtext: '各大景区排行',
      //子标题的样式
      subtextStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    //x|y
    xAxis: {
     type:'category', //图形图表在x轴均匀分布
    },
    yAxis: {},
    //布局组件
    grid:{
     left:20,
     bottom:20,
     right:20
    },
    //系列：决定显示图形图表是哪一种
    series:[
     {
          type:'bar',
          data:[10,20,30,40,50,60,70],
          //柱状图:图形上的文本标签
          label:{
               show:true,
               position:'insideTop',
               color:'#fff'
          },
          //是否显示背景颜色
          showBackground:true,
          backgroundStyle:{
               color:'#02468d'
          },
          //柱条的样式
          itemStyle:{
               borderRadius:[10,10,0,0],
               //柱条颜色
               color:function(data:any){
                    //给每一个柱条设置不同的背景颜色
                    const arr = ['#375A58','#375A68','#375A7E','#375A95','#375AA6','#375ACB','#0e3f71']
                    return arr[data.dataIndex]
               }
          }
     },
     {
          type:'line',
          data:[10,20,30,40,50,60,77],
          smooth:true, //平滑曲线
     }
    ],
    //提示
    tooltip:{
     backgroundColor:'rgba(50,50,50,.7)'
    }
  })
})
</script>
<style scoped lang="scss">
.r_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 0;
  .r_title {
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
