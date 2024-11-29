<template>
  <div>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>

  <el-popover placement="bottom" title="主题设置" :width="252" trigger="hover">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
        @change="setColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          @change="changeDark"
          class="mt-2"
          inline-prompt
          :active-icon="MoonNight"
          :inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
//获取用户相关的小仓库
import useUserStore from '../../../store/modules/user'
//获取路由器对象
import { useRouter, useRoute } from 'vue-router'
//获取小仓库
import useLayoutSettingStore from '../../../store/modules/setting'
import { MoonNight, Sunny } from '@element-plus/icons-vue';
const LayoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const $router = useRouter()
//获取路由对象(路径)
const $route = useRoute()
const dark = ref<boolean>(false)
//刷新按钮点击回调
const updateRefresh = () => {
  LayoutSettingStore.refresh = !LayoutSettingStore.refresh
}
//全屏按钮点击回调  -> 有兼容性问题
const fullScreen = () => {
  //DOM 对象的一个属性：可以用来判断当前是不是全屏模式[全屏：true；不是全屏：null/false]
  const full = document.fullscreenElement
  //切换成全屏模式
  if (!full) {
    //文档根节点的方法 requestFullscreen， 实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏模式 -> 退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录点击回调
const logOut = async () => {
  //1、需要向服务器发送请求[退出登录接口]
  //2、仓库当中关于用于相关的数据清空[token | username | avatar]
  //3、跳转到登录页面
  await userStore.userLogOut()
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//颜色组件需要的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//switch开关的change事件进行暗黑模式的切换
const changeDark = () => {
  //获取根节点
  const html = document.documentElement
  //判断HTML 标签是否有类名 dark
  dark.value?html.className="dark":html.className="";
}

//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>
<style scoped></style>
