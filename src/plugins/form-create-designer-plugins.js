/*
 * @Author        : djkloop
 * @Date          : 2020-12-29 16:30:08
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-02 11:48:58
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/plugins/form-create-designer-plugins.js
 */
import VueCompositionAPI from '@vue/composition-api'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import FormCreate from "@djkloop/fffff_pppp"
import Draggable from "vuedraggable"
import { ContentLoader } from 'vue-content-loader'

export default {
  async install (Vue) {
    Vue.use(VueCompositionAPI)
    Vue.use(ElementUI)
    Vue.use(FormCreate)
    Vue.component(Draggable.name, Draggable)
    Vue.component(ContentLoader.name, ContentLoader)
  }
}