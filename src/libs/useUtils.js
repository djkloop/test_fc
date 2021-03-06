/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:07:50
 * @LastEditTime  : 2021-02-03 11:09:28
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

export const useResetForceUpdate = vm => {
    vm.$forceUpdate()
}

/// 去掉 useCommonWrapper 加的元素
/// 获取真实的转换规则
export const useGetOriginItem = (item, pos = 1) => {
    return item.children[0].children[pos]
}

export const useGetToolsBox = item => {
    return item.children[0].children[0]
}