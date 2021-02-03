/* 
 * @Author       : Eug
 * @Date         : 2021-01-12 17:57:59
 * @LastEditTime : 2021-02-03 17:04:48
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/libs/useConset.js
 */
import { Notification } from 'element-ui'

/***************************************
 *                ERRCODE              *
 *                                     *
 *    999: 无意义                       *
 *    1000: 配置错误                    *
 *    1001：扩展extendTemplate报错      *  
 *                                    *
 *************************************/

export const errorCodeFunc = ( code = 999, message = '暂无错误信息!') => Notification({
  type: 'error',
  title: `错误code: ${code}`,
  message
})

export const triggerEventOptions = [
  {
    value: 'blur',
    label: 'blur'
  },
  {
    value: 'change',
    label: 'change'
  }
]