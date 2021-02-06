/* 
 * @Author       : Eug
 * @Date         : 2021-02-05 15:50:21
 * @LastEditTime : 2021-02-05 15:50:40
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/mock/col.js
 */
export default {
    "el-col": [
        {
            "type": "InputNumber",
            "title": "栅格span",

            "value": 0,
            "target": "props.span",
            "label": "栅格span"
        },
        {
            "type": "InputNumber",
            "title": "间隔格数",
            "props": {
                "min": 0
            },
            "value": 0,
            "target": "props.offset"
        }
    ]
}