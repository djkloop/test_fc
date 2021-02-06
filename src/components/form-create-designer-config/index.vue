<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-06 11:27:39
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-config/index.vue
-->
<template>
  <form-create v-model="fApi" :rule="rules" :option="options" />
</template>

<script>
import { onMounted, toRefs, watch } from '@vue/composition-api'
import { useFilter } from './useFormCreateDesignerConfig'
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
      const { fApi: toolsFapi } = useStateWithFormCreate
      toolsFapi.on('change', (e) => useFilter(e, mainFapi, toolsFapi))
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