import { createApp } from 'vue'
import App from './App.vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置 element-plus 国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'
//获取应用实例对象
const app = createApp(App)
//安装element-plus插件
app.use(ElementPlus,{
     locale: zhCn,  //element-plus 国际化配置
});
//console.log(import.meta.env) //获取到了环境变量
//svg插件需要配置代码
import 'virtual:svg-icons-register'

//引入自定义插件对象：注册整个项目全局组件
import globalComponents from '@/components';
//安装自定义插件
app.use(globalComponents)
//安装仓库
app.use(pinia)
//引入模板的全局的样式
import '@/styles/index.scss'
//测试登录接口能否使用
// import axios from 'axios';
// axios({
//      url:'/api/user/login',
//      method:'post',
//      data:{
//           username:'admin',
//           password:'1111'
//      }
// })
//注册模板路由
app.use(router)
//引入路由鉴权文件
import './permisstion';

//引入自定义指令文件
import {isHasButton} from './directive/has';
isHasButton(app)
//将应用挂载在挂载点上
app.mount('#app')
