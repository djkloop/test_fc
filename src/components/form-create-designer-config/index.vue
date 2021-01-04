<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-04 23:48:20
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-config/index.vue
-->
<template>
  <form-create v-model="fApi" :rule="rules" :option="options" />
</template>

<script>
import { onMounted, toRefs, watch } from '@vue/composition-api'
// import { filter, map } from 'rxjs/operators'
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
    }
  },
  setup(props) {
    onMounted(() => {
      useStateWithFormCreate.fApi.on('change', e => {
        console.log(e, ' e')
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