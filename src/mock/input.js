/*
 * @Author       : Eug
 * @Date         : 2021-02-05 15:48:41
 * @LastEditTime  : 2021-02-06 12:34:26
 * @LastEditors   : djkloop
 * @Descripttion : Descripttion
 * @FilePath      : /test_fc/src/mock/input.js
 */
export default {
    "el-input": [
        {
            "type": "el-input",
            "title": "数据字段",
            "value": "",
            "props": {
                "disabled": true
            },
            "target": "field",
            "label": "数据字段"
        },
        {
            "type": "el-input",
            "title": "占位内容",
            "value": "",
            "target": "attrs.placeholder",
            "label": "占位内容"
        },
        {
            "target": "attrs.readonly",
            "label": "可读性",
            "type": "switch",
            "title": "可读性",
            "value": false
        },
        {
            "target": "attrs.disabled",
            "label": "禁用",
            "type": "switch",
            "title": "禁用",
            "value": false
        },
        {
            "type": "radio",
            "title": "尺寸",
            "value": "small",
            "target": "attrs.size",
            "options": [
                { "value": "medium", "label": "medium" },
                { "value": "small", "label": "small" },
                { "value": "mini", "label": "mini" }
            ],
            "label": "尺寸"
        },
        {
            "target": "attrs.showWordLimit",
            "label": "字数统计",
            "type": "switch",
            "title": "字数统计",
            "value": false
        },
        {
            "target": "title",
            "label": "",
            "type": "el-input",
            "title": "标题",
            "value": ""
        },
        {
            "target": "value",
            "label": "",
            "type": "el-input",
            "title": "内容",
            "attrs":{
                "maxLength": 0
            },
            "value": ""
        },
        {
            "type": "InputNumber",
            "target": "attrs.maxLength",
            "title": "最大输入长度",
            "label": "最大输入长度",
            "fcd_link": "value",
            "value": 0
        }
    ]
}