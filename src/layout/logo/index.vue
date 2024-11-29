<template>
     <div class="logo">
          <img :src="setting.logo" alt="" v-if="setting.logoShow">
          <p>{{ setting.title }}</p>
     </div>
</template>
<script lang="ts" setup>
import setting from '../../setting';
</script>
<script lang="ts">
  export default{
    name:"Logo"
  }
</script>
<style scoped lang="scss">
@import '../../styles/variable.scss';
     .logo {
          width: auto;
          height: $base-menu-logo-height;
          color: white;
          display: flex;
          align-items: center;
          padding: 10px;
          img {
               width: 30px;
               height: 40px;
          }
          p {
               font-size: $base-logo-title-fontSize;
               margin-left: 10px;
          }
     }
</style>