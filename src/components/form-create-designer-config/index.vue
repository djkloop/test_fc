<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-06 16:23:52
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-config/index.vue
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
    configItemJson: {
      type: Object,
      default: () => ({})
    },
    activeItemObservable$: {
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
        console.log(e, ' e')
        /// 先获取到主区域的item的key
        const { target_field } = fApi.getRule(e)
        /// 主区域的item
        let item = mainFapi.getRule(target_field)
        item = dot.set(item, fApi.getRule(e).target, fApi.getRule(e).value)
        mainFapi.updateRule(target_field, item)
      })
    })
    watch(() => props.activeItemObservable$, (v) => {
      if (v.field) {
        useStateWithFormCreate.rules = v.observerConfigItem$.value[v.field]
      }
    }, {
      immediate: false
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