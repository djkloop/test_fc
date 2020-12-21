/*
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-21 17:00:51
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/main.js
 */
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Draggable from "vuedraggable"
import App from './App.vue'
import router from './router'
import store from './store'
Vue.use(VueCompositionAPI)
Vue.use(ElementUI)
Vue.component(Draggable.name, Draggable)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
