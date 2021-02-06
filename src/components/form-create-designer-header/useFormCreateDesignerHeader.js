/* 
 * @Author       : Eug
 * @Date         : 2021-02-03 14:51:07
 * @LastEditTime : 2021-02-05 15:55:53
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/components/form-create-designer-header/useFormCreateDesignerHeader.js
 */
/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 15:41:38
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-03 11:24:56
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-header/useFormCreateDesignerHeader.js
 */
import { getConfigJsonFactory } from '@/libs/useFormCreateStore'
import { useHeaderState } from './useState'
import MockData from '@/mock'

export const useFetchAllConfigJsonTemplate = () => {
  try {
    /*
       模拟后台发送请求数据
       文件位置：
         xxxxxxxx/public/data/typ.config.json
     */
    //  fetch('../data/type.config.json')
    //   .then(result => result.json())
    //   .then(data => {
    //     if (data.code === 200) {
    //       getConfigJsonFactory().setDefaultTypeJsonTemplate(data.result)
    //       setTimeout(() => (
    //         useHeaderState.loading = false
    //       ), 500)
    //     }
    //   })
    getConfigJsonFactory().setDefaultTypeJsonTemplate(MockData)
    setTimeout(() => (
      useHeaderState.loading = false
    ), 500)
    console.log(MockData);

  } catch (error) {
    console.log(error)
  }
}