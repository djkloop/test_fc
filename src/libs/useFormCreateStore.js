/*
 * @Author       : djkloop
 * @Date         : 2021-01-09 14:48:21
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-03 12:16:05
 * @Description  : 头部注释
 * @FilePath      : /test_fc/src/libs/useFormCreateStore.js
 */
import { reactive } from '@vue/composition-api'
import { cloneDeep, isPlainObject } from 'lodash'
import { useAutoField, useGetOriginItem } from './useUtils'
import { errorCodeFunc } from './useConset'
import { useCommonEventWithClick, useCommonEvnetWithDraggable } from './useCommonEvent'
import * as dot from 'dot-wild'


function _setFieldItem(_isFormItem, obj, _this) {
  const targetProps = _isFormItem ? 'field' : 'name'
  if (!_this.cloneItemCachKey[obj[targetProps]]) {
    let cloneFieldProps = cloneDeep(_this.configItems[obj[targetProps]])
    obj[targetProps] = useAutoField()
    if (_isFormItem) {
      obj['name'] = obj[targetProps]
      obj['id'] = obj[targetProps]
      obj['title'] = obj[targetProps]
    }
    cloneFieldProps = dot.set(cloneFieldProps, '*.target_field', obj[targetProps])
    _this.configItems[obj[targetProps]] = cloneFieldProps
    _this.cloneItemCachKey[obj[targetProps]] = true
  }
}

/// 前期先协定成这样，后期有可能扩展每个item的属性等其它操作
/// 暂时抽离出来
function ConfigJsonItem(item) {
  const { field, type, name } = item
  this.field = field
  this.name = name
  this.type = type
  /// 缓存一份
  this._fc_cache_item = cloneDeep(item)
  /// 获取原始的dom结构
  this.fcd_origin_item = useGetOriginItem(item, 1)
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
  /// 每一个每一个的item集合
  this.configItems = reactive({})
  ///
  this.cloneItemCachKey = reactive({})
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
 * @param {Object} extendTemplate 自定义组件typjson
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
Mediator.prototype.createModelWithConfigItem = function (configInstance) {
  const { fcd_origin_item } = configInstance
  const { _fc_cache_item } = configInstance
  const { type, field, name } = fcd_origin_item
  let commonValidateRules = this.configAllTypeJson['common-validate-rules']
  const commonRulesLast = commonValidateRules.splice(-1)
  commonValidateRules = [commonValidateRules, commonRulesLast]
  /// 布局组件要可以设置底部的el-col
  /// 所以要继续循环rule
  let cloneConfigJsonArray = cloneDeep(this.configAllTypeJson[type]) || []
  const _field = field || name
  if (_fc_cache_item.design.type === 'form') {
    commonValidateRules.forEach(validateItem => {
      validateItem.forEach(requireItem => {
        requireItem['field'] = useAutoField()
        requireItem['target_field'] = _field
      })
    })

    console.log(commonValidateRules)
  }
  if (cloneConfigJsonArray.length) {
    /// TODO: 抽逻辑
    cloneConfigJsonArray.forEach(cloneConfigJsonItem => {
      /// 给右边的每个rule生成field
      cloneConfigJsonItem['field'] = useAutoField()
      /// 指定双向绑定主区域key的对应field
      cloneConfigJsonItem['target_field'] = _field
      /// 判断当前规则的target的值在主区域当前激活的item上是否有相关属性
      /// 如果有的话取主区域设置给右边的item当做默认值
      if (dot.has(fcd_origin_item, cloneConfigJsonItem.target)) {
        const val = dot.get(fcd_origin_item, cloneConfigJsonItem.target)
        cloneConfigJsonItem['value'] = val
      }
    })

    /// 再来就是判断是否是布局组件如果是布局组件需要继续像下循环children 就是两个el-col
    let childrenConfigJsonArray = []
    /// TODO: 把el-*换成通用的判断
    if (fcd_origin_item.type === 'el-row') {
      childrenConfigJsonArray = fcd_origin_item.children.map((childreConfigJsonItem, index) => {
        /// 先获取当前组件的所有子组件
        /// 然后根据每个子组件的类型获取对应的type-json
        /// 然后在循环每个type-json数组取匹配target然后给对应的item赋值
        /// 最后返回出当前的type-json合并到总的数组里面去拍平
        const chidlrenCloneConfigJsonArray = cloneDeep(this.configAllTypeJson[childreConfigJsonItem.type]) || []
        if (Array.isArray(chidlrenCloneConfigJsonArray) && chidlrenCloneConfigJsonArray.length) {
          chidlrenCloneConfigJsonArray.forEach((chidlrenCloneConfigItem) => {
            chidlrenCloneConfigItem['field'] = useAutoField()
            chidlrenCloneConfigItem['title'] = `第${index+1}个${chidlrenCloneConfigItem['title']}`
            /// el-col组件因为是布局组件没有field，所有它的tagrt_filed是组件的name
            chidlrenCloneConfigItem['target_field'] = childreConfigJsonItem.name
            if (dot.has(childreConfigJsonItem, chidlrenCloneConfigItem.target)) {
              const val = dot.get(childreConfigJsonItem, chidlrenCloneConfigItem.target)
              chidlrenCloneConfigItem['value'] = val
            }
          })
          return chidlrenCloneConfigJsonArray
        } else {
          errorCodeFunc(1001, `当前第${index + 1}子组件没有对应的属性配置JSON！为了保证代码运行，请添加对应的配置属性！`)
        }
      })
    }
    cloneConfigJsonArray = [...cloneConfigJsonArray, ...childrenConfigJsonArray].flat(Infinity)
  } else {
    errorCodeFunc(1000, "当前组件没有对应的属性配置JSON!")
  }
  /// ...
  this.configItems[_field] = cloneConfigJsonArray
  return {
    field: _field,
    rightAllRules: this.configItems
  }
}

Mediator.prototype.getModelWithConfigItem = function (name) {
  return this.configItems[name]
}

Mediator.prototype.removeModelWithConfigItem = function (key) {
  return Reflect.deleteProperty(this.configItems, key)
}

/**
 *
 * @param {*} item 当前被激活的对象（cloneDeep）
 */
Mediator.prototype.copyModelWithConfigItem = function (activeItem) {
  /// 开始拷贝
  this.__getFieldWithCopy(activeItem)
  /// 拷贝完成需要处理特殊的标签
  this.cloneItemCachKey = {}
  this.__setDraggableProps([activeItem])
  return {
    copyItem: activeItem,
    rightAllRules: this.configItems
  }
}

Mediator.prototype.__setDraggableProps = function (list) {
  const len = list.length
  for (let i = 0; i < len; i++) {
    const ele = list[i]
    if (ele.children && ele.children.length) {
      if (ele.type && ele.type === 'draggable') {
        ele.props.list = ele.children[0].children
      }
      this.__setDraggableProps(ele.children)
    }
  }
}


Mediator.prototype.__getFieldWithCopy = function (item) {
  const _forEachObject = (obj) => {
    for (const key in obj) {
      // eslint-disable-next-line
      if (obj.hasOwnProperty(key)) {
        /// 判断子级是否有并且长度大于0
        const isBreakList = [
          'form-create-designer-widget__item__tools form-create-designer-widget__item__tools__active',
          'form-create-designer-widget__item__tools',
          'form-create-designer-widget__item__key',
          'el-icon-delete',
          'el-icon-document-copy'
        ]
        /// icon
        /// tools
        if (isBreakList.includes(obj.class)) {
          if (obj.type !== 'el-row') {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
          }
          break
        }
        if (key === 'children' && Array.isArray(obj.children) && obj.children.length) {
          /// 判断下el-row
          if (obj.type !== 'el-row') {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
          }
          this.__getFieldWithCopy(obj.children)
        } else {
          /// 如果是item 需要去找全局的对象里面找到对应的key
          const isFormItem = Reflect.has(obj, 'field')
          if (isFormItem) {
            _setFieldItem(isFormItem, obj, this)
          } else if(key === 'type' && obj.type === 'el-row') {
            _setFieldItem(false, obj, this)
          } else if(key === 'design' && obj.design && obj.design.type === 'form') {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
            useCommonEventWithClick(obj, true)
          } else if (key === 'design' && obj.design && obj.design.type === 'layout') {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
            useCommonEventWithClick(obj, true)
          } else if (key === 'type' && obj.type === 'draggable') {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
            Reflect.deleteProperty(obj.props, 'clone')
            useCommonEvnetWithDraggable(obj, true)
          } else {
            Reflect.has(obj, 'name') ?  obj.name = useAutoField() : ''
          }
        }
      }
    }
    return obj
  }

  /// 循环子级
  if (Array.isArray(item)) {
    item.forEach(it => {
      if(typeof it === 'object') {
        _forEachObject(it)
      }
    })
  } else if(Object.keys(item).length) {
    _forEachObject(item)
  }
}


const SingleMediatorInstance = (function() {
  var instance
  return function(item) {
    if (!instance) {
      instance = new Mediator()
      if (item) {
        return instance.createModelWithConfigItem(item)
      }
    } else if(item) {
      return instance.createModelWithConfigItem(item)
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
