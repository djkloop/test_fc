<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-05 14:19:03
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
      const { fApi } = useStateWithFormCreate
      fApi.on('change', e => {
        // console.log(e, ' e')
        // console.log(fApi.getRule(e))
        // console.log(props.configItemJson);
        let item = props.configItemJson.children[0].children[1]
        item = dot.set(item, fApi.getRule(e).target, fApi.getRule(e).value)
        console.log(item);
        console.log(fApi.getRule(e).target_field);
        props.mainFapi.updateRule(fApi.getRule(e).target_field, item)
      })
    })
    watch(() => props.activeItemObservable$, (v) => {
      if (v.field) {
        useStateWithFormCreate.rules = v.observerConfigItem$.value[v.field]
        v.observerConfigItem$.subscribe({
          next: x => console.log(x, ' x')
        })
        console.log(useStateWithFormCreate.rules)
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