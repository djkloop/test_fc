/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 18:19:47
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 19:13:35
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/packages/store/index.js
 */
import { reactive } from '@vue/composition-api'
import { cloneDeep } from 'lodash'
import { Observable } from 'rxjs'



function ConfigJsonItem(field, type) {
  this.field = field
  this.type = type
}

function Mediator() {
  this._config_json = reactive({})
  this._observer_list = {}

}

Mediator.prototype.SetDefaultTemplate = function (defaultJson) {
  this._config_json = defaultJson
}

Mediator.prototype.ExtendTemplate = function (extendJson) {
  this._config_json = cloneDeep(extendJson)
}

Mediator.prototype.CreateObserver = function(field, item) {
  const mediatorObserver = new Observable(observer => {
    observer.next('hello world')
    setTimeout(() => {
      observer.next('fuck')
    }, 2000)
  })
  mediatorObserver.subscribe(data =>  console.log(data))
  this._observer_list.push({
    field,
    item,
    mediatorObserver
  })
}

Mediator.prototype.GetObserver = function() {

}

export const configJsonItemFactory = (field, type) => {
  const configjsonitem = new ConfigJsonItem(field, type)
  new Mediator().CreateObserver(configjsonitem)
}

export {
  Mediator,
  ConfigJsonItem
}