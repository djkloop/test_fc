/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:02:32
 * @LastEditTime: 2020-12-29 15:47:45
 * @LastEditors: yeyuhang
 * @Descripttion: 头部注释
 */
import { useAutoField } from "./useUtils"
import classnames from "classnames";
import { useWrapperDrag } from "./useFormCreateDesigner";

/// 抹平左侧列表到form-create的input规则
/// 根据不同的字段使用方案这里需要单独设计
/// 但是需要在这个方法把form-create对应的组件规则补齐
/// 例如form-create需要唯一的field

export const useTransferInput = (item) => {
    item["type"] = "el-input";
    const onlyField = useAutoField();
    item["field"] = onlyField;
    item["title"] = onlyField;
    item["id"] = onlyField;
};

 /// 抹平左侧列表组件到form-create的row规则
/// 根据不同的字段使用方案这里需要单独设计
/// 但是需要在这个方法把form-create对应的组件规则补齐
/// 例如form-create需要唯一的field
export const useTransferRow = (item) => {
    item["type"] = "el-row";
    item["class"] = classnames("fc-drag-grid-row");
    item["children"] = [
        {
        type: "el-col",
        props: { span: 12 },
        children: [useWrapperDrag()],
        },
        {
        type: "el-col",
        props: { span: 12 },
        children: [useWrapperDrag()],
        },
    ];
};