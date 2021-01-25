/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:31:58
 * @LastEditTime  : 2021-01-25 17:12:40
 * @LastEditors   : djkloop
 * @Descripttion: 头部注释
 */
import FormCreate from '@djkloop/fffff_pppp'
import { useAutoField, useUniqueId, useGetOriginItem, useGetToolsBox } from "@/libs/useUtils"
import { cloneDeep } from "lodash"
import { useStateWithDraggables, useStateWithFormCreate, useStateWithPage } from "./useState"
import { useStateWithFormCreate as useStateWithRight } from "@/components/form-create-designer-config/useState"
import { useTransferRow, useTransferInput } from "./useTransfer"
import { reactive, ref } from "@vue/composition-api"
import classnames from 'classnames'
import { createConfigJsonItemFactory, getConfigJsonFactory } from '@/libs/useFormCreateStore'
import { useCommonEventWithClick } from '@/libs/useCommonEvent'
import { useCloneFromItem } from '@/libs/useCommonRules'
import * as dot from 'dot-wild'



const _useClearActiveClass = () => {
    /// 删除上一个激活的activeItem类名
    if (useStateWithPage.activeItem) {
        useStateWithFormCreate.fApi.updateRule(useStateWithPage.activeItem.name, {
            class: classnames('form-create-designer-widget__item')
        })
        useStateWithFormCreate.fApi.updateRule(useGetToolsBox(useStateWithPage.activeItem).name, {
            class: classnames('form-create-designer-widget__item__tools')
        })
    }
}

/**
 * 删除当前的item
 * @param {*} item
 */
const _useClickDelete = () => {
    const { fApi } = useStateWithFormCreate
    const { fApi: rightFApi } = useStateWithRight
    const name = useStateWithPage.activeItem.name
    const rightItem = useGetOriginItem(useStateWithPage.activeItem)
    const rightName = rightItem.field || rightItem.name
    /// 先把主区域删了
    fApi.removeField(name)
    const storeFactory = getConfigJsonFactory()
    /// 去store里面删掉对应的对象
    storeFactory.removeModelWithConfigItem(rightName)
    /// 再去把右边的删了
    rightFApi.reload([])
    /// 如果下面还有其它item，激活其它的item
}
/**
 * 拷贝当前的元素
 * @param {*} item
 */
const _useClickCopy = () => {
    /// ...
    const originItem = useGetOriginItem(useStateWithPage.activeItem)
    const cloneDeepOriginItem = cloneDeep(originItem)
    const deletProps = ['field', 'name', 'value', '_id']
    deletProps.forEach(prop => {
        Reflect.deleteProperty(cloneDeepOriginItem, prop)
    })
    /// 复制
    const copyActiveItem = FormCreate.copyRule(useStateWithPage.activeItem)
    let { copyItem } = getConfigJsonFactory().copyModelWithConfigItem(copyActiveItem)
    _useClearActiveClass()
    copyItem = useCommonEventWithClick(copyItem)
    useStateWithFormCreate.fApi.append(copyItem, useStateWithPage.activeItem.name)
    useStateWithPage.activeItem = copyItem
    const _item = useStateWithFormCreate.fApi.getRule(copyItem.name)
    useSetActiveItem(_item)
}
/// clone 时触发的事件
/// 嵌套的拖拽列表和最外层的拖拽列表都处理相同的逻辑
const _useCloneItem = item => {
    console.log('main-clone')
    const { fApi } = useStateWithFormCreate
    /******************************************* */
    /* clone 的时候一定要深拷贝 要不然一堆bug         */
    /******************************************* */
    let cloneItem = cloneDeep(item)
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
        /** ****************************************** ** /
         *  1、先把item所有的集合的key，value 用dot库拍平
         *  2、然后拿到所有的keys集合
         *  3、循环拿到的keys集合拼接成字符串判断field的是否存在
         *  4、如果存在就循环获取的keys，判断是否存在field并且要排除 props.list.*.fields 这种特殊情况
         *  5、拿到field
         *   5.1、把每一个单独的formitem field key 用 . 拆成一个数组
         *   5.2、根据拆成的数组拿到formitem的父级 (div) 数组
         *   5.3、再根据拆成的数据拿到formitem的父级的上层 el-col 数组
         *   5.4、在根据获取的两个formitem（div）和 el-col key 数组转成字符串
         *   5.5、先获取formItem（div）并且clone一份
         */
        let keyValues = dot.flatten(cloneItem)
        let keys = Object.keys(keyValues)
        if (keys.join('.').indexOf('field') !== -1) {
            keys.forEach(key => {
                if (key.indexOf('.field') !== -1 && key.indexOf('.props') === -1) {
                    /// 拿到当前formItem（就是当前元素不包括div）的key 并且用 . 切成数组
                    let formItemKeyPathArray = key.split('.')
                    /// 然后取到formitem的父级（div）数组
                    let formItemKeyParentPathArray = formItemKeyPathArray.slice(0, formItemKeyPathArray.length - 5)
                    /// 再获取到div的上层el-col路径
                    let parentElColNameStrArray = formItemKeyParentPathArray.slice(0, formItemKeyParentPathArray.length - 6)
                    /// 当前的formItem（div）字符串路径
                    let formItemKeyParentPathStr = formItemKeyParentPathArray.join('.')
                    /// el-col的字符串路径
                    let parentElColNameStr = parentElColNameStrArray.join('.')
                    /// 获取 formItem（div）的 item
                    let _itemBox = cloneDeep(dot.get(cloneItem, formItemKeyParentPathStr))
                    /// 删除 主区域 rules 里面的当前 item
                    fApi.removeField(_itemBox.name)
                    /// 更新 _itemBox 里面的规则 跟非 layout 组件一样
                    useCloneFromItem(_itemBox)
                    /// 然后更新完之后在重新添加回去
                    /// 这里要先更新主区域 rules
                    fApi.append(_itemBox, dot.get(cloneItem, parentElColNameStr).name, true)
                    /// 然后在更新当前的cloneItem
                }
            })
        }
    }
    useGetOriginItem(cloneItem)["name"] = onlyField;
    return cloneItem
}


/// change 时触发的事件
/// 拖拽的时候如果发生了删除事件需要把rule里面的相对应的规则删除
const _useChangeItem = ({ removed }) => {
    console.log('main-change')
    console.log(removed)
    if (removed) {
        const item = useGetOriginItem(removed.element)
        /// TODO: 删除的时候激活上一个
        if (removed.element && (item.field || item.name)) {
            useStateWithFormCreate.fApi.removeField(item.field || item.name)
            /// 去数据集合删除
            getConfigJsonFactory().removeModelWithConfigItem(item.field || item.name)
        }
    }
}

/**
 * 内部 formitem 组件激活方法
 */
const _useSetFormItemActiveItem = item => {
    const { fApi } = useStateWithFormCreate
    /// 然后在给当前的item加active类名
    fApi.updateRule(item.name, {
        class: classnames(item['class'], 'form-create-designer-widget__item__active')
    })
        /// 给tool加类名
        fApi.updateRule(useGetToolsBox(item).name, {
        class: classnames(useGetToolsBox(item).class, 'form-create-designer-widget__item__tools__active')
    })
}

/**
 * 内部 layout 组件激活方法
 */
const _useSetLayoutActiveItem = item => {
    const { fApi } = useStateWithFormCreate
    /// 然后在给当前的item加active类名
    fApi.updateRule(item.name, {
        class: classnames(item['class'], 'form-create-designer-widget__item__active')
    })

    /// 给tool加类名
    fApi.updateRule(useGetToolsBox(item).name, {
        class: classnames(useGetToolsBox(item).class, 'form-create-designer-widget__item__tools__active')
    })

}


/// 当前页面激活的item
export const useSetActiveItem = (item) => {
    /// 删除上一个激活的activeItem类名
    _useClearActiveClass()

    /// 这里 表单组件 和 布局组件 有区别
    if (item.design.type === 'layout') {
        _useSetLayoutActiveItem(item)
    } else {
        _useSetFormItemActiveItem(item)
    }

    /// 设置当前激活的item
    useStateWithPage.activeItem = item
    /// 去总的type json表取对应的item所对应的类型
    const activeRightConfigJson = createConfigJsonItemFactory(item)
    useStateWithPage.activeModelWithConfigItem = activeRightConfigJson
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
                class: 'el-icon-document-copy',
                on: {
                    click: e => {
                        e.stopPropagation()
                        _useClickCopy()
                    }
                }
            },
            {
                type: 'i',
                class: 'el-icon-delete',
                on: {
                    click: () => _useClickDelete()
                },
                native: true
            }
        ]
    }
    const relayChildren = item
    children.push(rightTools) /// 工具区
    children.push(relayChildren) /// 真实的元素
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
/// 这里在每个item上面加了2层dom
/// 取最原始的item的时候要去掉这2层
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
    cloneItem = useCommonEventWithClick(cloneItem)
    return cloneItem;
};

/// 点击左侧列表触发的事件
export const useNavClickCloneItem = (item) => {
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
            change: _useChangeItem,
            add: (e) => {
                useSetActiveItem(e.item._underlying_vm_)
            },
            end: (e) => {
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
            clone: _useCloneItem
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
                console.log('main-add')
                useSetActiveItem(e.item._underlying_vm_)
            },
            end: (e) => {
                console.log('main-end')
                useSetActiveItem(e.item._underlying_vm_)
            }
        },
    };
};

/// 设置全局上下文
export const useSetVM = vm => useStateWithPage.vm = vm

export const useSetEmptyStatus = (isShow) => {
    useStateWithPage.isShowEmpty = isShow
}


