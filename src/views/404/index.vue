<template>
     <div class="f_box">
          <img src="../../assets/images/404.png" alt="">
          <el-button type="primary" @click="getHome" class="f_btn">首页</el-button>
     </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const $router = useRouter()
const getHome = () => {
     $router.push('/home')
}
</script>
<style scoped lang="scss">
.f_box{
     width: 100vw;
     height: 100vh;
     display: flex;
     justify-content: center;
     img{
          width: 800px;
          height: 400px;
          margin-left: 400px;
          margin-top: 88px;
     }
     .f_btn{
          margin-top: 50px;
     }
}
</style>