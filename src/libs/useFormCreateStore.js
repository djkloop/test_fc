/*
 * @Author       : djkloop
 * @Date         : 2021-01-09 14:48:21
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-11 01:20:50
 * @Description  : 头部注释
 * @FilePath     : /test_fc/src/libs/useFormCreateStore.js
 */
import { reactive } from '@vue/composition-api'
import { cloneDeep, isPlainObject } from 'lodash'
import { useAutoField } from './useUtils'
import { errorCodeFunc } from './useConset'
import dot from 'dot-wild'

/// 前期先协定成这样，后期有可能扩展每个item的属性等其它操作
/// 暂时抽离出来
function ConfigJsonItem(originItem) {
  const { field, type, name } = originItem
  this.field = field
  this.name = name
  this.type = type
  /// 缓存一份
  this._fcd_origin_item = cloneDeep(originItem)
}

/**
 * 中介者
 *
 * 这里存着所有的表单json type配置表
 * 所有的操作方法都存放在这里
 */
function Mediator() {
  /// 所有的json type
  this.configAllTypeJson = reactive({})
  /// 每一个item
  this.configItem = reactive({})
}

/**
 * 设置默认typejson模板
 * 
 * @param {Object} defaultTemplate 默认的ype json模板
 */
Mediator.prototype.setDefaultTypeJsonTemplate = function (defaultTemplate) {
  this.configAllTypeJson = defaultTemplate
}

/**
 * 扩展自定义组建的时候需要设置对应的type模板
 * 
 * @param {Obecjt} extendTemplate 自定义组件typjson
 */
Mediator.prototype.extendTypeJsonTemplate = function (extendTemplate) {
  if (isPlainObject(extendTemplate)) {
    this.configAllTypeJson = Object.assign({}, this.configAllTypeJson, extendTemplate)
  } else {
    errorCodeFunc(1001, '扩展extendTemplate报错')
  }
}

/**
 * 根据返回的实例去生成右边的区域
 * 
 * @param {ConfigJsonItem} configInstance 每个item的实例
 */
Mediator.prototype.createModelWithConfig = function () {
  // const { field, name, type } = configInstance
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
export const createConfigJsonItemFactory = item => {
  /// 去创建一个实例
  const configJsonitemInstance = new ConfigJsonItem(item)
  if (configJsonitemInstance.field || configJsonitemInstance.name) {
    return SingleMediatorInstance(configJsonitemInstance)
  } else {
    errorCodeFunc(1000, '当前item缺少name或field')
    return null
  }
}

/**
 * 获取当前form-create-designer实例
 */
export const getConfigJsonFactory = () => SingleMediatorInstance()
