/* 
 * @Author       : Eug
 * @Date         : 2021-01-15 10:36:20
 * @LastEditTime : 2021-02-03 16:41:01
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/components/form-create-designer-config/useState.js
 */
/*
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:13:07
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-14 23:40:29
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-config/useState.js
 */
import { reactive } from "@vue/composition-api";

export const useStateWithFormCreate = reactive({
  fApi: {},
  rules: [],
  options: {
      submitBtn: false,
      resetBtn: false,
      form: {
          col: false,
          size: 'mini',
          labelPosition: 'top',
          labelWidth: 'auto'
      }
  }
});

export const useStateWithPage = reactive({
  vm: null
})