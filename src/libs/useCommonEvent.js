/*
 * @Author        : djkloop
 * @Date          : 2021-01-25 14:53:36
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-25 15:19:39
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/libs/useCommonEvent.js
 */
import {
  useStateWithPage as MainState,
  useStateWithFormCreate as MainFormCreate
} from '@/views/useState'
import { useSetActiveItem } from '@/views/useFormCreateDesigner'


/**
 * 给指定规则添加click事件
 * @param {*} item
 * @param {Boolean} isSelf 是否更改原来的引用
 */
 export const useCommonEventWithClick = (item, isSelf) => {
   return isSelf ? Object.assign(item, {
    on: {
      click: e => {
        console.log('click', 1)
        e.stopPropagation()
        if (MainState.activeItem.name !== item.name) {
            let _field = item.field || item.name
            const _item = MainFormCreate.fApi.getRule(_field)
            useSetActiveItem(_item)
        }
      }
    }
 }) : Object.assign({}, item, {
    on: {
      click: e => {
        console.log('click', 2)
        e.stopPropagation()
        if (MainState.activeItem.name !== item.name) {
            let _field = item.field || item.name
            const _item = MainFormCreate.fApi.getRule(_field)
            useSetActiveItem(_item)
        }
      }
    }
 })
 }