/*
 * @Author       : djkloop
 * @Date         : 2021-01-04 22:52:35
 * @LastEditors  : djkloop
 * @LastEditTime : 2021-01-04 23:12:49
 * @Description  : 
 * @FilePath     : /test_fc/src/libs/useRx.js
 */

/************************************************
 *                                              *
 *  https://github.com/vuejs/vue-rx/issues/120  *
 *                                              *
 ************************************************/

import { ref, onBeforeUnmount } from '@vue/composition-api';
import { Subject } from 'rxjs';

function subscribeTo(
  observable,
  next,
  error,
  complete
) {
  const subscription = observable
    .subscribe(next, error, complete);
  onBeforeUnmount(() => {
    subscription.unsubscribe();
  });

  return subscription;
}

export function useObservable(observable,defaultValue) {
  const handler = ref(defaultValue)
  subscribeTo(
    observable,
    value => {
      handler.value = value;
    },
    error => {
      throw error;
    }
  );

  return handler;
}

export function useSubscription(observable,next,error,complete) {
  return subscribeTo(observable, next, error, complete);
}

export function useDOMEvent() {
  const subject = new Subject();
  return {
    subject,
    callback: (event) => {
      subject.next(event);
    }
  };
}