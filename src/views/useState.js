/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:19:29
 * @LastEditTime  : 2021-02-06 12:27:26
 * @LastEditors   : djkloop
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
                readonly: false,
                placeholder: 'good'
            },
            /// 每个组件的设计相关字段
            design: {
                type: 'form', /// 属于什么类型的组件
                name: '输入框'
            }
        },
        {
            id: 3,
            label: "el-switch",
            lib_type: "switch",
            attrs: {
                readonly: false,
            },
            /// 每个组件的设计相关字段
            design: {
                type: 'form', /// 属于什么类型的组件
                name: '开关'
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
            inline: false,
            labelPosition: 'right',
            hideRequiredAsterisk: false,
            labelWidth: '125px',
            showMessage: true,
            inlineMessage: false,
            statusIcon: false,
            validateOnRuleChange: true,
            disabled: false,
            size: 'small'
        },
        info: {
            // 提示消息类型,popover,tooltip
            type: 'popover',
            placement: 'bottom'
        }
    }
});




export const useStateWithPage = reactive({
    isShowEmpty: true,
    vm: null,
    activeItem: null,
    activeModelWithConfigItem: null,
    closeDrawer: false
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