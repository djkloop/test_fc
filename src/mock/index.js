/* 
 * @Author       : Eug
 * @Date         : 2021-02-05 15:47:59
 * @LastEditTime : 2021-02-05 15:54:21
 * @LastEditors  : Eug
 * @Descripttion : Descripttion
 * @FilePath     : /test_fc/src/mock/index.js
 */

import Common from "./common";
 import Col from "./col";
 import Input from "./input";
 import Row from "./row";
 import Switch from "./switch";

 export default{
    ...Common,
    ...Col,
    ...Input,
    ...Row,
    ...Switch
 }