import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import uView from '@/uni_modules/uview-ui'
import share from './common/share.js'
Vue.use(uView)
Vue.config.productionTip = false
App.mpType = 'app'
// 导入并挂载全局的分享方法
Vue.mixin(share)

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif