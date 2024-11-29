<template>
  <div class="box">
    <!-- <h3>App根组件</h3> -->
    <!-- <el-button type="primary" size="default" :icon="Plus">主要按钮</el-button>
    <el-button type="success" size="small" :icon="Edit">主要按钮</el-button>
    <el-button type="danger" size="default" :icon="Delete">主要按钮</el-button>
    <el-pagination
      :page-sizes="[100, 200, 300, 400]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    /> -->
    <!-- 测试svg图标使用 -->
    <!-- <svg-icon name="loop" color="red" width="30px" height="30px"></svg-icon>
    <Pagination></Pagination> -->
    <!-- 路由 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
//引入图标组件
import { Delete, Plus, Edit } from '@element-plus/icons-vue'
//console.log(import.meta.env) //获取到了环境变量
import request from '@/utils/request';
import { onMounted } from 'vue';
import { reqLogin } from './api/user';


//当你组件挂载完毕测试发一个请求
onMounted(()=>{
  // request({
  //   url:'/user/login',
  //   method:'post',
  //   data:{
  //     username:'admin',
  //     password:'1111'
  //   }
  // }).then(res => {console.log(res)} ),
  // reqLogin({
  //   username:'admin',
  //   password:'1111'
  // })
})
</script>

<style scoped lang="scss">
  @import "@/styles/variable.scss";
  
  .box{
    h3{
      color: $color;
    }
  }
  
</style>
