<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 17:54:29
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-config/index.vue
-->
<template>
  <form-create v-model="fApi" :rule="rules" :option="options" />
</template>

<script>
import { getCurrentInstance, toRefs, watch  } from '@vue/composition-api'
import {
  useStateWithFormCreate
} from './useState'
import { useWatchConfigJSON, useSetVM } from './useFormCreateDesignerConfig'
export default {
  name: 'FormCreateDesignerConfig',
  props: {
    configJson: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    useSetVM(proxy)
    watch(() => props.configJson, useWatchConfigJSON, {
      deep: true
    })
    return {
      ...toRefs(useStateWithFormCreate)
    }
  }
}
</script>

<style lang="scss">
@import "./form-create-designer-config.scss";
</style>