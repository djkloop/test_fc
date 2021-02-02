/*
 * @Author        : djkloop
 * @Date          : 2021-02-02 11:20:21
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-02 11:22:13
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-header/useState.js
 */
import { reactive } from '@vue/composition-api'

const useHeaderState = reactive({
  loading: true
})

export {
  useHeaderState
}