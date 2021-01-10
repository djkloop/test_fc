/*
 * @Author        : djkloop
 * @Date          : 2021-01-06 14:52:05
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-09 15:18:26
 * @Description   : 头部注释
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
