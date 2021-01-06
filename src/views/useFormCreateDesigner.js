/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:31:58
 * @LastEditTime  : 2021-01-06 17:48:34
 * @LastEditors   : djkloop
 * @Descripttion: 头部注释
 */
import { useAutoField, useUniqueId, useGetOriginItem, useGetToolsBox } from "@/libs/useUtils"
import { cloneDeep } from "lodash";
import { useStateWithDraggables, useStateWithFormCreate, useStateWithPage } from "./useState";
import { useTransferRow, useTransferInput } from "./useTransfer";
import { reactive, ref } from "@vue/composition-api";
import classnames from 'classnames'
import { createConfigJsonItemFactory } from '@/packages/store'

/// clone 时触发的事件
/// 嵌套的拖拽列表和最外层的拖拽列表都处理相同的逻辑
const _useCloneItem = item => {
    /******************************************* */
    /* clone 的时候一定要深拷贝 要不然一堆bug         */
    /******************************************* */
    const cloneItem = cloneDeep(item)
    /// 布局组件不需要这些field
    const onlyField = useAutoField();
    if (item.design.type !== 'layout') {
        useGetOriginItem(cloneItem)["field"] = onlyField;
        useGetOriginItem(cloneItem)["title"] = onlyField;
        useGetOriginItem(cloneItem)["id"] = onlyField;
        useGetOriginItem(cloneItem)['prev_field'] = item.field
        /// 把key也换掉
        cloneItem.children[0].children[2]['children'] = [onlyField]
    } else {
        console.log('____')
    }
    useGetOriginItem(cloneItem)["name"] = onlyField;
    return cloneItem
}


/// change 时触发的事件
/// 拖拽的时候如果发生了删除事件需要把rule里面的相对应的规则删除
const _useChangeItem = ({ removed }) => {
    if (removed) {
        if (removed.element && (removed.element.field)) {
            useStateWithFormCreate.fApi.removeField(removed.element.field)
        }
    }
}

/// 当前页面激活的item
const useSetActiveItem = (item) => {
    console.log(item, ' useSetActiveItem - item');
    console.log('*********');
    console.log(useStateWithPage.activeItem, ' useStateWithPage.activeItem');

    if (useStateWithPage.activeItem) {
        /// 删除上一个激活的activeItem类名
        useStateWithFormCreate.fApi.updateRule(useStateWithPage.activeItem.name, {
            class: classnames('form-create-designer-widget__item')
        })
        useStateWithFormCreate.fApi.updateRule(useStateWithPage.activeItem.children[0].children[0].name, {
            class: classnames('form-create-designer-widget__item__tools')
        })
    }
    // item['class'] = classnames(item['class'], 'form-create-designer-widget__item__active')
    useStateWithFormCreate.fApi.updateRule(item.name, {
        class: classnames(item['class'], 'form-create-designer-widget__item__active')
    })
    useStateWithFormCreate.fApi.updateRule(useGetToolsBox(item).name, {
        class: classnames(useGetToolsBox(item).class, 'form-create-designer-widget__item__tools__active')
    })
    // item.children[0].children[0].class = classnames(item.children[0].children[0].class, 'form-create-designer-widget__item__tools__active')
    // useStateWithPage.activeItem = cloneDeep(item)
    useStateWithPage.activeItem = item

    /// 最原始的item（这里需要优化）
    const originItem = useGetOriginItem(item)

    /// 去总的json表取对应的item
    const activeItemObservable$ = createConfigJsonItemFactory(originItem)
    useStateWithPage.activeItemObservable$ = activeItemObservable$
}

const useWrapperChildren = item => {
    const children = []
    /// 先生成右侧tools区域
    const rightTools =
    {
        type: 'div',
        class: 'form-create-designer-widget__item__tools',
        name: useAutoField(),
        children: [
            {
                type: 'i',
                class: 'el-icon-document-copy'
            },
            {
                type: 'i',
                class: 'el-icon-delete'
            }
        ]
    }
    const relayChildren = item
    children.push(rightTools)
    children.push(relayChildren)
    /// 如果是表单组件需要生成底部key
    if (item.design.type !== 'layout' ) {
        const selfId = useAutoField()
        const bottomKey = {
            type: 'div',
            class: classnames('form-create-designer-widget__item__key'),
            name: selfId,
            attrs: {
              'data-self-id': selfId,
              'data-form-item-id': item.field /// 当前对应的form表单组件的id
            },
            children: [item.field]
        }
        children.push(bottomKey)
    }
    return children
}

/// 统一的外层样式标签
const useCommonWrapper = item => {
    return {
        type: 'div',
        name: useAutoField(),
        design: item.design,
        config_rule: item.config_rule,
        class: classnames('form-create-designer-widget__item'),
        children: [{
            type: 'div',
            name: useAutoField(),
            class: classnames('form-create-designer-widget__item__box'),
            children: useWrapperChildren(item)
        }]
    }
}

const useCommonEvent = (item) => {
    return Object.assign({}, item, {
        on: {
            click: function(e) {
                e.stopPropagation()
                if (useStateWithPage.activeItem.name !== item.name) {
                    let _field = item.field || item.name
                    const _item = useStateWithFormCreate.fApi.getRule(_field)
                    useSetActiveItem(_item)
                }
            }
        }
    })
}
/// 左侧列表拖拽触发clone事件
export const useNavCloneItem = item => {
    let cloneItem = cloneDeep(item);
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
    cloneItem = useCommonWrapper(cloneItem)
    cloneItem = useCommonEvent(cloneItem)
    return cloneItem;
};

/// 点击左侧列表触发的事件
export const useNavClickCloneItem = item => {
    /// 如果当前没有被激活的item说明是主区域没有任何元素
    const _cloneItem = useNavCloneItem(item)
    const cloneItem = _useCloneItem(_cloneItem)
    if (!useStateWithPage.activeItem) {
        useStateWithDraggables.mainList.push(cloneItem)
    } else {
        /// 否则就在当前激活的activeItem后面添加
        useStateWithFormCreate.fApi.append(cloneItem, useStateWithPage.activeItem.name)
    }
    /// 保证动画执行正确
    setTimeout(() => {
        useSetActiveItem(cloneItem)
    }, 16)
}

/// 初始化生成中间区域
export const useInitDraggableItem = () => {
    const initItem = reactive({
        type: "draggable",
        props: {
            list: useStateWithDraggables.mainList,
            tag: "div",
            clone: _useCloneItem,
            move: ({ draggedContext }) => {
                useSetActiveItem(draggedContext.element)
            }
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
            change: _useChangeItem,
            add : (e) => {
                useSetActiveItem(e.item._underlying_vm_)
            }
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
            move: ({ draggedContext }) => {
                useSetActiveItem(draggedContext.element)
            }
        },
        attrs: {
            ...useStateWithDraggables.draggableMainOptions,
        },
        class: "form-create-designer-main__draggable form-create-designer-main__draggable__nested",
        children: [
            {
                type: "transition-group",
                props: {
                    name: "fc-drag-list",
                    tag: "div",
                },
                class: "fc-drag-transition form-create-designer-main__draggable__list form-create-designer-main__draggable__nested__list",
                children: otherList.value,
                native: true,
            },
        ],
        on: {
            change: _useChangeItem,
            add: (e) => {
                console.log(useStateWithFormCreate.fApi.getRule(e.item._underlying_vm_.name), ' add__fapi-w')
                console.log(e.item._underlying_vm_, ' add__under-w')
                useSetActiveItem(e.item._underlying_vm_, 'add')
            }
        },
    };
};

/// 设置全局上下文
export const useSetVM = vm => useStateWithPage.vm = vm

export const useSetEmptyStatus = (isShow) => {
    useStateWithPage.isShowEmpty = isShow
}


