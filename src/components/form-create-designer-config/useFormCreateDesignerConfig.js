/*
 * @Author        : djkloop
 * @Date          : 2020-12-30 18:15:20
 * @LastEditors  : djkloop
 * @LastEditTime : 2020-12-30 22:57:37
 * @Description   : 头部注释
 * @FilePath     : /test_fc/src/components/form-create-designer-config/useFormCreateDesignerConfig.js
 */
import { useAutoField, useResetForceUpdate } from '@/libs/useUtils'
import { useStateWithFormCreate, useStateWithPage } from './useState'
import { useStateWithPage as MainState, useStateWithFormCreate as MainFormCreate } from '@/views/useState'

 export const useWatchConfigJSON = (nv) => {
   useStateWithFormCreate.rules = nv.config_rule.map(item => {
    item.field = useAutoField()
    item['on'] = {
      'input': e => {
        const field = MainState.activeItem.children[0].children[1].field
        MainFormCreate.fApi.updateRule(field, {
          [item.target.params]: {
              [item.target.property]: e
            }
         })
      }
    }
    return item
  })
  useResetForceUpdate(useStateWithPage.vm)
 }

 export const useSetVM = vm => useStateWithPage.vm = vm