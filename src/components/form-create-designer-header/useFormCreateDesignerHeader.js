/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 15:41:38
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 18:57:01
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-header/useFormCreateDesignerHeader.js
 */
import { reactive } from '@vue/composition-api'
import { Mediator } from '@/packages/store'
export const useHeaderState = reactive({
  loading: true
})

 export const useFetchAllConfigJsonTemplate = () => {
   try {
     fetch('../data/type.config.json')
      .then(result => result.json())
      .then(data => {
        new Mediator().SetDefaultTemplate(data)
      })
   } catch (error) {
      console.log(error)
   }
 }