/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:31:58
 * @LastEditTime  : 2020-12-29 19:25:53
 * @LastEditors   : djkloop
 * @Descripttion: 头部注释
 */
import { useAutoField, useUniqueId, useResetForceUpdate } from "./useUtils"
import { cloneDeep } from "lodash";
import { useStateWithDraggables, useStateWithFormCreate, useStateWithPage } from "./useState";
import { useTransferRow, useTransferInput } from "./useTransfer";
import { reactive, ref } from "@vue/composition-api";
import classNames from 'classnames'



/// clone 时触发的事件
/// 嵌套的拖拽列表和最外层的拖拽列表都处理相同的逻辑
const _useCloneItem = item => {
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
const _useChangeItem = ({ removed }) => {
    if (removed) {
        if (removed.element && removed.element.field) {
            useStateWithFormCreate.fApi.removeField(removed.element.field)
        }
    }
}

const useCommonClass = (item) => {
    item.class = classNames(item.class, 'form-create-designer-widget__item')
}

const useSetActiveItem = (item) => {
    item['class'] = classNames(item['class'], 'form-create-designer-widget__active')
}

/// 左侧列表拖拽触发clone事件
export const useNavCloneItem = (item) => {
    const cloneItem = cloneDeep(item);
    useUniqueId(cloneItem);
    useCommonClass(cloneItem);
    useSetActiveItem(cloneItem);
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

/// 初始化生成中间区域
export const useInitDraggableItem = () => {
    const initItem = reactive({
        type: "draggable",
        props: {
            list: useStateWithDraggables.mainList,
            tag: "div",
            clone: _useCloneItem
        },
        attrs: {
            ...useStateWithDraggables.draggableMainOptions,
        },
        class: "form-create-designer-main__draggable",
        children: [
            {
                type: "transition-group",
                props: {
                    name: "fc-drag-list",
                    tag: "div",
                },
                class: "form-create-designer-main__draggable__list",
                children: useStateWithDraggables.mainList,
                native: true,
            },
        ],
        on: {
            change: _useChangeItem
        },
    });
    /// 初始化的时候需要一个空的拖拽列表
    useStateWithFormCreate.rules.push(initItem);
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
            clone: _useCloneItem,
        },
        attrs: {
            ...useStateWithDraggables.draggableMainOptions,
        },
        class: "form-create-designer-main__draggable fc-drag-grid-box",
        children: [
            {
                type: "transition-group",
                props: {
                    name: "fc-drag-list",
                    tag: "div",
                },
                class: "fc-drag-transition form-create-designer-main__draggable__list",
                children: otherList.value,
                native: true,
            },
        ],
        on: {
            change: _useChangeItem
        },
    };
};

/// 设置全局上下文
export const useSetVM = vm => useStateWithPage.vm = vm

export const useSetEmptyStatus = (isShow) => {
    useStateWithPage.isShowEmpty = isShow
    useResetForceUpdate(useStateWithPage.vm)
}


