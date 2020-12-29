/*
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-29 16:27:20
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import FormCreateDesigner from '../views/FormCreateDesigner.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FormCreateDesigner',
    component: FormCreateDesigner
  }
]

const router = new VueRouter({
  routes
})

export default router
