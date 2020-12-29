/*
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-29 16:32:20
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/main.js
 */
import Vue from 'vue'
import installPlugins from '@/plugins/form-create-designer-plugins'
import App from './App.vue'
import router from './router'
import store from './store'
installPlugins(Vue)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
