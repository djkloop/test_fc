/* 
 * @Author       : Eug
 * @Date         : 2021-02-05 15:51:41
 * @LastEditTime : 2021-02-05 15:52:11
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/mock/common.js
 */
export default {
    "common-validate-rules": [
        {
            "type": "el-switch",
            "title": "是否是必填",
            "target": "validate",
            "validateTargetProps": "required"
        },
        {
            "type": "el-input",
            "title": "提示信息",
            "target": "validate",
            "validateTargetProps": "message"
        },
        {
            "type": "select",
            "title": "触发方式",
            "target": "validate",
            "validateTargetProps": "trigger",
            "value": "blur"
        },
        {
            "type": "group",
            "target": "validate",
            "title": "其它校验规则",
            "props": {
                "rules": [
                    {
                        "type": "el-input",
                        "title": "报错提示",
                        "validateTargetProps": "message",
                        "value": ""
                    },
                    {
                        "type": "el-input",
                        "title": "正则表达式",
                        "validateTargetProps": "pattern",
                        "value": ""
                    },
                    {
                        "type": "select",
                        "title": "触发方式",
                        "validateTargetProps": "trigger",
                        "value": "blur"
                    }
                ]
            },
            "value": []
        }
    ]
}