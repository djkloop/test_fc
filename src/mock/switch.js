/* 
 * @Author       : Eug
 * @Date         : 2021-02-05 15:50:52
 * @LastEditTime : 2021-02-05 15:51:14
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/mock/switch.js
 */
export default {
    "el-switch": [
        {
            "target": "attrs.disabled",
            "label": "禁用",
            "type": "switch",
            "title": "禁用",
            "value": false
        },
        {
            "target": "props.width",
            "label": "",
            "type": "el-input-number",
            "title": "宽度",
            "value": 40
        },
        {
            "target": "attrs.readonly",
            "label": "可读性",
            "type": "switch",
            "title": "可读性",
            "value": false
        }
    ]
}