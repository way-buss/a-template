<template>
  <div class="m_box" ref="map">
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入地图的 json 数据
import chinaJSON from './china.json'
//获取 dom 元素
const map = ref()
//注册地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  const mychart = echarts.init(map.value)
  //设置配置项
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      //地图的位置调试
      top: 200,
      zoom:1.2,
      //地图上文字的调试
      label: {
        show: true, //文字显示出来
        color:'white'
      },
      itemStyle: {
        //每一个多边形的样式
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
        opacity:.8,
        borderColor:'#2d7ab6',
        borderWidth:1,
      },
      //地图高亮的效果
      emphasis:{
          itemStyle:{
               color:'#1571ae'
          },
          label:{
               color:'white',
               fontSize:18
          }
      }
    },
    //布局位置
    grid:{
     left:0,
     right:0,
     top:0,
     bottom:0
    },
    series:[{
     type:'lines', //航线的系列
     data:[
          {
               coords:[
                    [116.405285,39.904989], //起点
                    [91.132212,29.660361], //终点
               ],
               //统一的样式设置
               lineStyle:{
                    color:'white',
                    curveness:.25, //弧度
               }
          },
          {
               coords:[
                    [106.504962,29.533155], //起点
                    [121.472644,31.231706], //终点
               ],
               //统一的样式设置
               lineStyle:{
                    color:'white',
                    curveness:.25, //弧度
               }
          },
          {
               coords:[
                    [113.280637,23.125178], //起点
                    [101.778916,36.623178], //终点
               ],
               //统一的样式设置
               lineStyle:{
                    color:'white',
                    curveness:.25, //弧度
               }
          }
     ],
     //开启动画特效
     effect:{
          show:true,
          symbol:'triangle',
          symbolSize:5,
     }
    }]
  })
})
</script>
<style scoped></style>
