/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:19:29
 * @LastEditTime: 2021-01-06 18:24:08
 * @LastEditors: Please set LastEditors
 * @Descripttion: 头部注释
 */
import { reactive } from "@vue/composition-api"

export const useStateWithNav = reactive({
    components: [
        {
            id: 1,
            label: "el-row",
            lib_type: "row",
            /// 每个组件的设计相关字段
            design: {
                type: 'layout', /// 属于什么类型的组件
                name: '栅格布局'
            }
        },
        {
            id: 2,
            label: "el-input",
            lib_type: "input",
            attrs: {
                readonly: true,
                placeholder: 'good'
            },
            /// 每个组件的设计相关字段
            design: {
                type: 'form', /// 属于什么类型的组件
                name: '输入框'
            }
        },
    ]
});

export const useStateWithFormCreate = reactive({
    fApi: {},
    rules: [],
    options: {
        submitBtn: false,
        resetBtn: false,
        form: {
            col: false,
            size: 'small'
        }
    }
});


export const useStateWithPage = reactive({
    isShowEmpty: true,
    vm: null,
    activeItem: null,
    activeItemObservable$: null
})

export const useStateWithDraggables = reactive({
    draggableNavOptions: {
        group: { name: "dragGroup", pull: "clone", put: false },
        sort: false,
        animation: 180,
        draggable: ".form-create-designer-widget__label",
        ghostClass: "moving",
    },
    draggableMainOptions: {
        group: "dragGroup",
        ghostClass: "fc-drage-moving",
        animation: 180,
    },
    mainList: []
})