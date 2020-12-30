/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:07:50
 * @LastEditTime  : 2020-12-29 18:53:09
 * @LastEditors   : djkloop
 * @Descripttion: 头部注释
 */
import { uniqueId } from "lodash";

/// generate field
export const useAutoField = () => {
    return "field_" + Math.random().toString(36).substring(3, 11);
};

/// generate unique id
export const useUniqueId = (item) => {
    item._id = uniqueId("drag_key_id_");
};

/// TODO: HACK 不知道是不是bug 必须要forceUpdate
/// 待后期修复
export const useResetForceUpdate = vm => {
    vm.$forceUpdate()
}
