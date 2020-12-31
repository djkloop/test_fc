/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 15:41:38
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 17:42:18
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-header/useFormCreateDesignerHeader.js
 */
import { reactive } from '@vue/composition-api'
export const useHeaderState = reactive({
  loading: true,
  json: {}
})

 export const useFetchAllConfigJsonTemplate = () => {
   try {
     fetch('../data/type.config.json')
      .then(result => result.json())
      .then(data => {
        console.log(data, useHeaderState)
        useHeaderState.json = data
      })
   } catch (error) {
      console.log(error)
   }
 }