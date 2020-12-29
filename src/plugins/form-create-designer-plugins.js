/*
 * @Author        : djkloop
 * @Date          : 2020-12-29 16:30:08
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-29 16:31:53
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/plugins/form-create-designer-plugins.js
 */
import VueCompositionAPI from '@vue/composition-api'
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import Draggable from "vuedraggable"

function installPlugins(Vue) {
  Vue.use(VueCompositionAPI)
  Vue.use(ElementUI)
  Vue.component(Draggable.name, Draggable)
}

export default installPlugins