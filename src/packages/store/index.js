/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 18:19:47
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-06 15:01:52
 * @Description   : 这个文件有很多东西是为了学习存在的...例如rxjs
 * @FilePath      : /test_fc/src/packages/store/index.js
 */
import { reactive } from '@vue/composition-api'
import { Notification } from 'element-ui'
import { cloneDeep } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { useAutoField } from '@/libs/useUtils'
import { CODE } from '@/libs/useConset'
import * as dot from 'dot-wild';


/// 前期先协定成这样，后期有可能扩展每个item的属性等其它操作
/// 暂时抽离出来
function ConfigJsonItem(originItem) {
  const { field, type, name } = originItem
  this.field = field
  this.name = name
  this.type = type
  this.originItem = originItem
}

/**
 * 中介者
 *
 * 这里存着所有的表单json type配置表
 * 所有的操作方法都存放在这里
 */
function Mediator() {
  this.configJson = reactive({})
  this.configItems$ = new BehaviorSubject({})

}

Mediator.prototype.SetDefaultTypeJSONTemplate = function (defaultTypeJson) {
  this.configJson = defaultTypeJson
}

Mediator.prototype.ExtendTemplate = function (extendJson) {
  this.configJson = cloneDeep(extendJson)
}

/**
 * 根据添加的item获取新的右边对象
 *
 * @param {ConfigItem} configInstance 每一个小的item组件属性
 */
Mediator.prototype.CreateObserverItem = function(configInstance) {
  /// 取到对应的type然后从主json加载出来一份
  /// 然后clone一份给右侧区域用
  const { type, field, name, originItem } = configInstance
  let cloneConfigJsonArray = cloneDeep(this.configJson[type]) || []
  const _field = field || name
  if (Array.isArray(cloneConfigJsonArray) && cloneConfigJsonArray.length) {
    cloneConfigJsonArray.forEach(item => {
      item['field'] = useAutoField() /// 每个item生成唯一的key
      item['target_field'] = _field /// 每个item要对应当前的item key
      if(dot.has(originItem, item.target)) {
        const val = dot.get(originItem, item.target)
        item['value'] = val
      }
    })
    let childrenConfigArray = []
    /// 如果是布局组件 需要把底部的col的属性也拿出来拍平给右边设置
    if (originItem.type === 'el-row') {
      childrenConfigArray = originItem.children.map((childrenItem, idx) => {
        /// 现先获取当前组件的所有子组件
        /// 然后根据每个子组件的类型获取对应的type-json
        /// 然后在循环每个type-json数组取匹配target然后给对应的item赋值
        /// 最后返回出当前的type-json合并到总的数据里面去拍平
        const chidlrenCloneConfigJsonArray = cloneDeep(this.configJson[childrenItem.type]) || []
        if (Array.isArray(chidlrenCloneConfigJsonArray) && chidlrenCloneConfigJsonArray.length) {
          chidlrenCloneConfigJsonArray.forEach(chidlrenCloneConfigItem => {
            chidlrenCloneConfigItem['field'] = useAutoField()
            /// el-col组件因为是布局组件没有field，所有它的tagrt_filed是组件的name
            chidlrenCloneConfigItem['target_field'] = childrenItem.name
            if (dot.has(childrenItem, chidlrenCloneConfigItem.target)) {
              const val = dot.get(childrenItem, chidlrenCloneConfigItem.target)
              chidlrenCloneConfigItem['value'] = val
            }
          })
          return chidlrenCloneConfigJsonArray
        } else {
          Notification({
            title: `错误code: ${CODE.ERR_1.code}`,
            message: `当前第${idx + 1}子组件没有对应的属性配置JSON！为了保证代码运行，请添加对应的配置属性！`
          })
        }
      })
    }
    cloneConfigJsonArray = [...cloneConfigJsonArray, ...childrenConfigArray].flat(Infinity)
  } else {
    Notification.error("当前组件没有对应的属性配置JSON!")
  }
  this.configItems$.next({...this.configItems$.value, ...{ [_field]: cloneConfigJsonArray } })
  return {
    observerConfigItem$: this.configItems$,
    field: _field
  }
}

/**
 * 根据key值取出对应的observe
 *
 * @param {string} field 字段名称
 */
Mediator.prototype.GetObserver = function(field) {
  return this.configItems$[field]
}

const SingleMediatorInstance = (function() {
  var instance
  return function(item) {
    if (!instance) {
      instance = new Mediator()
      if (item) {
        return instance.CreateObserverItem(item)
      }
    } else if(item) {
      return instance.CreateObserverItem(item)
    }
    return instance
  }
})()

/// 通过中介者单例创建每个item
export const createConfigJsonItemFactory = (originItem) => {
  const configJsonitemInstance = new ConfigJsonItem(originItem)
  if (originItem.field || originItem.name) {
    return SingleMediatorInstance(configJsonitemInstance)
  } else {
    Notification.warning("报错了！")
    return null
  }
}

/// 获取单例
export const getConfigJsonFactory = () => SingleMediatorInstance()