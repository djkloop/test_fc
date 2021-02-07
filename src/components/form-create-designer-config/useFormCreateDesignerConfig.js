/*
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:15:20
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-06 12:28:49
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-config/useFormCreateDesignerConfig.js
 */
import { nextTick } from '@vue/composition-api'
import { set as dSet } from 'dot-values2'
import { cloneDeep } from 'lodash'
import { useStateWithFormCreate } from './useState'
const _methods = {
  /// 验证相关
  validate(mainFapi, rightRule, cloneItem, target_field) {
    let _item
    if (rightRule.type === 'group') {
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
    mainFapi.updateRule(target_field, _item)
    nextTick(() => {
      mainFapi.refreshValidate()
    })
  },
  value(toolsFapi, rightRule) {
    const {  rules: rightRules } = useStateWithFormCreate
    const fcd_link_item = rightRules.find(rule => rule.target === rightRule.fcd_link)
    const _item = dSet(fcd_link_item, rightRule.target, rightRule.value)
    toolsFapi.updateRule(fcd_link_item.field, _item)
  }
}


 export const useFilter = (e, mainFapi, toolsFapi) => {
  /// 先获取到主区域的item的key
  const { target_field } = toolsFapi.getRule(e)
  /// 主区域的item
  let item = mainFapi.getRule(target_field)
  const cloneItem = cloneDeep(item)
  const rightRule = toolsFapi.getRule(e)
  /// 拿到需要特殊处理的target属性组合
  const methodskeys = Object.keys(_methods)
  const isLinkTarget = Reflect.has(rightRule, 'fcd_link')
  if ((methodskeys.includes(rightRule.target) && isLinkTarget) || isLinkTarget) {
    if (isLinkTarget) {
      _methods[rightRule.fcd_link](toolsFapi, rightRule)
      const _item = dSet(cloneItem, rightRule.target, rightRule.value)
      mainFapi.updateRule(target_field, _item)
    } else {
      _methods[rightRule.target](mainFapi, rightRule, cloneItem, target_field)
    }
  } else {
    const _item = dSet(cloneItem, rightRule.target, rightRule.value)
    mainFapi.updateRule(target_field, _item)
  }
}