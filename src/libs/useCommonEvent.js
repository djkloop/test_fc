/*
 * @Author        : djkloop
 * @Date          : 2021-01-25 14:53:36
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-25 17:15:54
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/libs/useCommonEvent.js
 */
import {
  useStateWithPage as MainState,
  useStateWithFormCreate as MainFormCreate
} from '@/views/useState'
import { useSetActiveItem } from '@/views/useFormCreateDesigner'
import { useGetOriginItem, useAutoField } from './useUtils'
import { useCloneFromItem } from './useCommonRules'
import { getConfigJsonFactory } from './useFormCreateStore'
import * as dot from 'dot-wild'
import { cloneDeep } from "lodash"

/**
 * 给指定规则添加click事件
 * @param {*} item
 * @param {Boolean} isSelf 是否更改原来的引用
 */
 export const useCommonEventWithClick = (item, isSelf) => {
   return isSelf ? Object.assign(item, {
    on: {
      click: e => {
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

 const _useCommonEventWithDraggableChange = (e) => {
  console.log(' copy-change')
   const { removed } = e
  if (removed) {
      const item = useGetOriginItem(removed.element)
      /// TODO: 删除的时候激活上一个
      if (removed.element && (item.field || item.name)) {
          MainFormCreate.fApi.removeField(item.field || item.name)
          /// 去数据集合删除
          getConfigJsonFactory().removeModelWithConfigItem(item.field || item.name)
      }
  }
}

const _useCommonEventWithDraggableAdd = e => {
  console.log(' copy-add')
  useSetActiveItem(e.item._underlying_vm_)
 }

const _useCommonEventWithDraggableEnd = e => {
  console.log(' copy-end')
  useSetActiveItem(e.item._underlying_vm_)
}

const _useCommonEventWithDraggableClone = item => {
  const { fApi } = MainFormCreate
  console.log(' copy-clone')
    /******************************************* */
    /* clone 的时候一定要深拷贝 要不然一堆bug         */
    /******************************************* */
    let cloneItem = cloneDeep(item)
    /// 布局组件不需要这些field
    const onlyField = useAutoField();
    if (item.design.type !== 'layout') {
        useGetOriginItem(cloneItem)["field"] = onlyField;
        useGetOriginItem(cloneItem)["title"] = onlyField;
        useGetOriginItem(cloneItem)["id"] = onlyField;
        useGetOriginItem(cloneItem)['prev_field'] = item.field
        /// 把key也换掉
        cloneItem.children[0].children[2]['children'] = [onlyField]
    } else {
        /** ****************************************** ** /
         *  1、先把item所有的集合的key，value 用dot库拍平
         *  2、然后拿到所有的keys集合
         *  3、循环拿到的keys集合拼接成字符串判断field的是否存在
         *  4、如果存在就循环获取的keys，判断是否存在field并且要排除 props.list.*.fields 这种特殊情况
         *  5、拿到field
         *   5.1、把每一个单独的formitem field key 用 . 拆成一个数组
         *   5.2、根据拆成的数组拿到formitem的父级 (div) 数组
         *   5.3、再根据拆成的数据拿到formitem的父级的上层 el-col 数组
         *   5.4、在根据获取的两个formitem（div）和 el-col key 数组转成字符串
         *   5.5、先获取formItem（div）并且clone一份
         */
        let keyValues = dot.flatten(cloneItem)
        let keys = Object.keys(keyValues)
        if (keys.join('.').indexOf('field') !== -1) {
            keys.forEach(key => {
                if (key.indexOf('.field') !== -1 && key.indexOf('.props') === -1) {
                    /// 拿到当前formItem（就是当前元素不包括div）的key 并且用 . 切成数组
                    let formItemKeyPathArray = key.split('.')
                    /// 然后取到formitem的父级（div）数组
                    let formItemKeyParentPathArray = formItemKeyPathArray.slice(0, formItemKeyPathArray.length - 5)
                    /// 再获取到div的上层el-col路径
                    let parentElColNameStrArray = formItemKeyParentPathArray.slice(0, formItemKeyParentPathArray.length - 6)
                    /// 当前的formItem（div）字符串路径
                    let formItemKeyParentPathStr = formItemKeyParentPathArray.join('.')
                    /// el-col的字符串路径
                    let parentElColNameStr = parentElColNameStrArray.join('.')
                    /// 获取 formItem（div）的 item
                    let _itemBox = cloneDeep(dot.get(cloneItem, formItemKeyParentPathStr))
                    /// 删除 主区域 rules 里面的当前 item
                    fApi.removeField(_itemBox.name)
                    /// 更新 _itemBox 里面的规则 跟非 layout 组件一样
                    useCloneFromItem(_itemBox)
                    /// 然后更新完之后在重新添加回去
                    /// 这里要先更新主区域 rules
                    fApi.append(_itemBox, dot.get(cloneItem, parentElColNameStr).name, true)
                    /// 然后在更新当前的cloneItem
                }
            })
        }
    }
    useGetOriginItem(cloneItem)["name"] = onlyField;
    return cloneItem
}

 export const useCommonEvnetWithDraggable = (item, isSelf) => {
  item.props.list = cloneDeep(item.props.list)
  isSelf ? Object.assign(item, {
    props: {
      ...item.props,
      clone:_useCommonEventWithDraggableClone
    },
    on: {
      change: _useCommonEventWithDraggableChange,
      add: _useCommonEventWithDraggableAdd,
      end: _useCommonEventWithDraggableEnd
    }
  }) : Object.assign({}, item, {
    on: {
      change: _useCommonEventWithDraggableChange,
      add: _useCommonEventWithDraggableAdd,
      end: _useCommonEventWithDraggableEnd
    }
  })
 }


