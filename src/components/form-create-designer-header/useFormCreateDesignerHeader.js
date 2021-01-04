/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 15:41:38
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-04 22:09:27
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-header/useFormCreateDesignerHeader.js
 */
import { reactive } from '@vue/composition-api'
import { getConfigJsonFactory } from '@/packages/store'
export const useHeaderState = reactive({
  loading: true
})

 export const useFetchAllConfigJsonTemplate = () => {
   try {
     /*
        模拟后台发送请求数据
        文件位置：
          xxxxxxxx/public/data/typ.config.json
      */
     fetch('../data/type.config.json')
      .then(result => result.json())
      .then(data => {
        if (data.code === 200) {
          getConfigJsonFactory().SetDefaultTypeJSONTemplate(data.result)
          setTimeout(() => (
            useHeaderState.loading = false
          ), 2000)
        }
      })
   } catch (error) {
      console.log(error)
   }
 }