<!--
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:05:35
 * @LastEditors  : Eug
 * @LastEditTime : 2021-02-03 17:53:44
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-config/index.vue
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
        console.log(fApi.getRule(e), cloneItem)
        console.log(e);
        const rightRule = fApi.getRule(e)
        let _item
        if (rightRule.target === 'validate') {
          if (rightRule.type === 'group') {
            console.log('///',rightRule, cloneItem['validate']);
            if (cloneItem['validate'].length) {
              const _requiredRule = cloneItem['validate'][0]
               cloneItem['validate'] = [_requiredRule, ...rightRule.value]
              _item = cloneItem
            } else {
               cloneItem['validate'].push({
                required: false,
                message: '',
                trigger: 'blur'
              })
              cloneItem['validate'].push(...rightRule.value)
              _item = cloneItem
            }
          } else {
            if (cloneItem['validate'].length) {
              let requireRule = cloneItem['validate'][0]
              requireRule = dSet(requireRule, rightRule.validateTargetProps, rightRule.value)
              cloneItem['validate'][0] = requireRule
              _item = cloneItem
            } else {
              /// 
              cloneItem['validate'].push({
                required: false,
                message: '',
                trigger: 'blur',
                [rightRule.validateTargetProps]: rightRule.value
              })
              _item = cloneItem
            }
          }
          mainFapi.updateValidate(target_field, _item.validate)
          // mainFapi.sync(target_field)
        } else {
          _item = dSet(cloneItem, rightRule.target, rightRule.value)
          mainFapi.updateRule(target_field, _item)
        }
        console.log(mainFapi.getRule(target_field), 'target');
        
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