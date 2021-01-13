<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-13 16:01:35
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-config/index.vue
-->
<template>
  <form-create v-model="fApi" :rule="rules" :option="options" />
</template>

<script>
import { onMounted, toRefs, watch } from '@vue/composition-api'
import { set as dSet } from 'dot-values2'
import { cloneDeep } from 'lodash'
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
        const cloneItem = cloneDeep(item)
        console.log('getRule -> ', item)
        const _item = dSet(cloneItem, fApi.getRule(e).target, fApi.getRule(e).value)
        console.log(_item, ' ___')
        mainFapi.updateRule(target_field, _item)
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