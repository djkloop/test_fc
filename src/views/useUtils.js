/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:07:50
 * @LastEditTime: 2020-12-29 15:27:30
 * @LastEditors: yeyuhang
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