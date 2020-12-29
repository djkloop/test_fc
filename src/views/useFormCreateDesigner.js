/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:31:58
 * @LastEditTime: 2020-12-29 15:50:49
 * @LastEditors: yeyuhang
 * @Descripttion: 头部注释
 */
import { useAutoField, useUniqueId } from "./useUtils"
import { cloneDeep } from "lodash";
import { useStateWithDraggables, useStateWithFormCreate } from "./useState";
import { useTransferRow, useTransferInput } from "./useTransfer";
import { reactive, ref } from "@vue/composition-api";


/// format rules
export const useFormatDragItem = (item) => {
    const cloneItem = cloneDeep(item);
    useUniqueId(cloneItem);
    switch (cloneItem.lib_type) {
        case "row":
            useTransferRow(cloneItem);
            break;
        case "input":
            useTransferInput(cloneItem);
            break;
        default:
            break;
    }
    return cloneItem;
};


/// clone 时触发的事件
/// 嵌套的拖拽列表和最外层的拖拽列表都处理相同的逻辑
const useCloneItem = item => {
    /******************************************* */
    /* clone 的时候一定要深拷贝 要不然一堆bug         */
    /******************************************* */
    const cloneItem = cloneDeep(item)
    /// 布局组件不需要这些field
    /// 只需要脱离引用关系就行了
    if (item.design.type !== 'layout') {
        const onlyField = useAutoField();
        cloneItem["field"] = onlyField;
        cloneItem["title"] = onlyField;
        cloneItem["id"] = onlyField;
        cloneItem['prev_field'] = item.field
    }
    return cloneItem
}


/// change 时触发的事件
/// 拖拽的时候如果发生了删除事件需要把rule里面的相对应的规则删除
const useChangeItem = ({ removed }) => {
    if (removed) {
        if (removed.element && removed.element.field) {
            useStateWithFormCreate.fApi.removeField(removed.element.field)
        }
    }
}


/// 初始化生成中间区域
export const useInitDraggableItem = () => {
    const a = reactive({
        type: "draggable",
        props: {
            list: useStateWithDraggables.mainList,
            tag: "div",
            clone: useCloneItem
        },
        attrs: {
            ...useStateWithDraggables.draggableMainOptions,
        },
        class: "fc-drag-main",
        children: [
            {
                type: "transition-group",
                props: {
                    name: "fc-drag-list",
                    tag: "div",
                },
                class: "fc-drag-transition",
                children: useStateWithDraggables.mainList,
                native: true,
            },
        ],
        on: {
            change: useChangeItem
        },
    });
    /// 初始化的时候需要一个空的拖拽列表
    useStateWithFormCreate.rules.push(a);
} 


/// nested 组件规则
/// 这里是生成嵌套子列表的方法
/// 生成一个wrapper里面是一个空的列表
export const useWrapperDrag = () => {
    const otherList = ref([]);
    return {
        type: "draggable",
        props: {
            list: otherList.value,
            tag: "div",
            clone: useCloneItem,
        },
        attrs: {
            ...useStateWithDraggables.draggableMainOptions,
        },
        class: "fc-drag-main fc-drag-grid-box",
        children: [
            {
                type: "transition-group",
                props: {
                    name: "fc-drag-list",
                    tag: "div",
                },
                class: "fc-drag-transition fc-drag-list",
                children: otherList.value,
                native: true,
            },
        ],
        on: {
            change: useChangeItem
        },
    };
};