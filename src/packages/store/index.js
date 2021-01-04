/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 18:19:47
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-04 17:40:01
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/packages/store/index.js
 */
import { reactive } from '@vue/composition-api'
import { cloneDeep } from 'lodash'
import { BehaviorSubject } from 'rxjs'


/// 前期先协定成这样，后期有可能扩展每个item的属性等其它操作
/// 抽离出来
function ConfigJsonItem(field, type) {
  this.field = field
  this.type = type
}

function Mediator() {
  this._config_json = reactive({})
  this.configItems$ = new BehaviorSubject({})

}

Mediator.prototype.SetDefaultTypeJSONTemplate = function (defaultTypeJson) {
  this._config_json = defaultTypeJson
}

Mediator.prototype.ExtendTemplate = function (extendJson) {
  this._config_json = cloneDeep(extendJson)
}

/**
 * 根据添加的item获取新的右边对象
 *
 * @param {ConfigItem} configInstance 每一个小的item组件属性
 */
Mediator.prototype.CreateObserver = function(configInstance) {
  console.log(configInstance)
}

/**
 * 根据key值取出对应的observe
 *
 * @param {string} field 字段名称
 */
Mediator.prototype.GetObserver = function(field) {
  return this.configItems$[field]
}

var SingleInstance = (function() {
  var instance
  return function(item) {
    if (!instance) {
      instance = new Mediator()
      instance.CreateObserver(item)
    } else {
      instance.CreateObserver(item)
    }
    return instance
  }
})()

export const createConfigJsonItemFactory = (field, type) => {
  const configJsonitemInstance = new ConfigJsonItem(field, type)
  new SingleInstance(configJsonitemInstance)
}

export {
  Mediator,
  ConfigJsonItem
}