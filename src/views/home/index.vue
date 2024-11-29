<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div class="cardName">
          <h3 class="title">{{ getTime() }}好 {{ userStore.username }}</h3>
          <p class="subTitle">皮卡丘的快乐城堡</p>
        </div>
      </div>
    </el-card>
    <div class="svgImg">
      <svg-icon name="welcome" width="600px" height="252px"></svg-icon>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getTime } from '../../utils/time'
//引入用户相关的仓库，获取当前用户的头像、昵称
import useUserStore from '../../store/modules/user'
//获取存储用户信息的仓库对象
const userStore = useUserStore()
</script>
<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .cardName {
    margin-left: 20px;
    .title {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 900;
    }
    .subTitle {
      font-style: italic;
      color: rgb(172, 169, 169);
    }
  }
}
.svgImg{
     display: flex;
     justify-content: center;
     margin-top: 8%;
}
</style>
