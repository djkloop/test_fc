<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-12 22:42:31
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-config/index.vue
-->
<template>
  <form-create v-model="fApi" :rule="rules" :option="options" />
</template>

<script>
import { onMounted, toRefs, watch } from '@vue/composition-api'
// import { filter, map } from 'rxjs/operators'
import * as dot from 'dot-wild';
import {
  useStateWithFormCreate
} from './useState'
export default {
  name: 'FormCreateDesignerConfig',
  props: {
    activeModelWithConfigItem: {
      type: Object
    },
    mainFapi: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    onMounted(() => {
      const { mainFapi } = props
      const { fApi } = useStateWithFormCreate
      fApi.on('change', e => {
        /// 先获取到主区域的item的key
        const { target_field } = fApi.getRule(e)
        /// 主区域的item
        let item = mainFapi.getRule(target_field)
        // const keys = target.split('.')
        console.log('getRule -> ', item)
        // set(item[keys[0]], keys[1], fApi.getRule(e).value)
        dot.set(item, fApi.getRule(e).target, fApi.getRule(e).value)
        mainFapi.updateRule(target_field, item)
        console.log('mainRule -> ', mainFapi.getRule(target_field))
      })
    })
    watch(() => props.activeModelWithConfigItem, (v) => {
      if (v.field) {
        useStateWithFormCreate.rules = v.rightAllRules[v.field]
      }
    }, {
      immediate: false,
      deep: true
    })
    return {
      ...toRefs(useStateWithFormCreate),
    }
  }
}
</script>

<style lang="scss">
@import "./form-create-designer-config.scss";
</style>