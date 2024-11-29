import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

//引入 svg 需要用到插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //获取各种环境下的对应的变量
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve', //保证开发阶段使用 mock 接口
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    //
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          // additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy:{
        [env.VITE_APP_BASE_API]:{
          //获取数据的服务器地址设置
          target:env.VITE_SERVE,
          //需要代理跨域
          changeOrigin:true,
          //路径重写
          rewrite:(path) => path.replace(/^\/api/, '')
        }
      }

      //因为前面服务器跑不通了，后面改的
      // proxy: {
      //   '/api/admin/acl': {
      //     // 更新代理规则以匹配新的路径
      //     target: 'http://139.198.104.58:8212', // 目标后端服务
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      //   '/api': {
      //     //获取数据的服务器地址设置
      //     target: 'http://39.98.123.211:8510',
      //     //需要代理跨域
      //     changeOrigin: true,
      //     //路径重写
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
      
    },
  }
})
