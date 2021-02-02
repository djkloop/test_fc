/*
 * @Author: yeyuhang
 * @Date: 2020-12-29 15:02:32
 * @LastEditTime  : 2021-02-02 18:47:34
 * @LastEditors   : djkloop
 * @Descripttion: 头部注释
 */
import { useAutoField } from "@/libs/useUtils";
import classnames from "classnames";
import { useWrapperDrag } from "./useFormCreateDesigner";

/// 抹平左侧列表到form-create的input规则
/// 根据不同的字段使用方案这里需要单独设计
/// 但是需要在这个方法把form-create对应的组件规则补齐
/// 例如form-create需要唯一的field

export const useTransferInput = (item) => {
  item["type"] = "el-input";
  const onlyField = useAutoField();
  item["field"] = onlyField;
  item["title"] = onlyField;
  item["id"] = onlyField;
  item['validate'] =[
      { required: true, message: '请输入goods_name', trigger: 'blur' },
  ]
};

/// 抹平左侧列表到form-create的switch规则
/// 根据不同的字段使用方案这里需要单独设计
/// 但是需要在这个方法把form-create对应的组件规则补齐
/// 例如form-create需要唯一的field

export const useTransferSwitch= (item) => {
  item["type"] = "el-switch";
  const onlyField = useAutoField();
  item["field"] = onlyField;
  item["title"] = onlyField;
  item["id"] = onlyField;
  item["props"] = {
    width: 100
  }
};


/// 抹平左侧列表组件到form-create的row规则
/// 根据不同的字段使用方案这里需要单独设计
/// 但是需要在这个方法把form-create对应的组件规则补齐
/// 例如form-create需要唯一的field
export const useTransferRow = (item) => {
  item["type"] = "el-row";
  item["class"] = classnames(item.class, "form-create-designer-widget__row");
  item["name"] = useAutoField();
  item['attrs'] = {}
  item['props'] = {}
  item['style'] = {}
  item["children"] = [
    {
      type: "el-col",
      name: useAutoField(),
      props: { span: 12 },
      class: classnames("form-create-designer-widget__col"),
      children: [useWrapperDrag()]
    },
    {
      type: "el-col",
      name: useAutoField(),
      props: { span: 12 },
      class: classnames("form-create-designer-widget__col"),
      children: [useWrapperDrag()]
    }
  ];
};
