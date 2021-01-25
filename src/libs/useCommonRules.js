/*
 * @Author       : djkloop
 * @Date         : 2021-01-24 17:43:44
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-01-25 16:20:06
 * @Description  : 头部注释
 * @FilePath      : /test_fc/src/libs/useCommonRules.js
 */
import { useGetOriginItem, useAutoField } from './useUtils'

export const useCloneFromItem = (cloneItem) => {
  const onlyField = useAutoField();
  useGetOriginItem(cloneItem)['prev_field'] = useGetOriginItem(cloneItem).field
  useGetOriginItem(cloneItem)["field"] = onlyField;
  useGetOriginItem(cloneItem)["id"] = onlyField;
  /// 把key也换掉
  cloneItem.children[0].children[2]['children'] = [onlyField]
}