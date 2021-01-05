/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 18:19:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-05 14:18:42
 * @Description   : 这个文件有很多东西是为了学习存在的...例如rxjs
 * @FilePath      : /test_fc/src/packages/store/index.js
 */
import { reactive } from '@vue/composition-api'
import { Notification } from 'element-ui'
import { cloneDeep } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { useAutoField } from '@/libs/useUtils'
import * as dot from 'dot-wild';


/// 前期先协定成这样，后期有可能扩展每个item的属性等其它操作
/// 暂时抽离出来
function ConfigJsonItem(originItem) {
  const { field, type } = originItem
  this.field = field
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
  const { type, field, originItem } = configInstance
  const cloneConfigJsonArray = cloneDeep(this.configJson[type])
  cloneConfigJsonArray.forEach(item => {
    item['field'] = useAutoField() /// 每个item生成唯一的key
    item['target_field'] = field /// 每个item要对应当前的item key
    if(dot.has(originItem, item.target)) {
      const val = dot.get(originItem, item.target)
      console.log(val);
      item.value = val
      // dot.set(item, 'value', val)
      console.log(item);
    }
  })
  this.configItems$.next({...this.configItems$.value, ...{ [field]: cloneConfigJsonArray } })
  return {
    observerConfigItem$: this.configItems$,
    field
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
  if (originItem.field) {
    return SingleMediatorInstance(configJsonitemInstance)
  } else {
    Notification.warning("报错了！")
    return null
  }
}

/// 获取单例
export const getConfigJsonFactory = () => SingleMediatorInstance()