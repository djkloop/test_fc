/*
 * @Author        : djkloop
 * @Date          : 2020-12-31 18:19:47
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 18:41:17
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/packages/store/index.js
 */
import * as Rx from 'rxjs'

// function ConfigJsonItem(field, type) {
//   this.field = field
//   this.type = type
// }

function Mediator() {
  const mediatorObserver = new Rx.Observable(observer => {
    observer.next('hello world')
    setTimeout(() => {
      observer.next('fuck')
    }, 2000)
  })
  mediatorObserver.subscribe(data =>  console.log(data))
}

export {
  Mediator
}