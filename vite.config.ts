import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg 需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 配置mock数据
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 获取各种环境下的对应变量
  let env = loadEnv(mode, process.cwd()); // 第二个参数为根目录

  return {
    plugins: [
      vue(),
      // 配置mock数据
      viteMockServe({
        localEnabled: command === 'serve',
      }),
      // 配置svg的
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      })
    ],
    // 给src配置别名
    resolve: {
      alias: {
        // "@": path.resolve("./src"),  // 相对路径别名配置，使用 @ 代替 src
        '@': path.resolve(__dirname, 'src'),
      }
    },
    // 全局 scss变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {  // 该字段即为 api，根据不同环境变化
          // 获取数据服务器的地址
          target: env.VITE_SERVE,
          // 是否允许跨域
          changeOrigin: true,
          // 路径重写，将上述的 api 换为空，因为服务器接口没有api，如果有该字段可以不要
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
