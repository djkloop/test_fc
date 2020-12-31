<!--
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 18:03:53
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/views/FormCreateDesigner.vue
-->
<style lang="scss">
@import '@/assets/reset.sass';
@import '@/assets/browser.scss';
@import '@/assets/common.scss';
@import "./form-create-designer.scss";
</style>
<style lang="scss">

.el-form {
  height: 100%;
  & > .el-row {
    height: 100%;
  }
}
</style>
<template>
  <div class="form-create-designer">
    <el-container>
      <el-header class="form-create-designer-header">
        <form-create-designer-header />
      </el-header>
     <el-container>
        <el-aside width="350px">
          <div class="form-create-designer-widget__list">
            <draggable
              :list="components"
              tag="ul"
              v-bind="draggableNavOptions"
              :clone="useNavCloneItem"
            >
              <li
                class="form-create-designer-widget__label"
                :key="item.id"
                v-for="item in components"
                @click="useNavClickCloneItem(item)"
              >
                <a>
                  <i class="icon"></i>
                  <span>{{ item.design.name }}</span>
                </a>
              </li>
            </draggable>
          </div>
        </el-aside>
        <el-main class="form-create-designer-main">
          <div v-if="isShowEmpty" class="common-empty-text">
            从左侧选择控件添加
          </div>
          <form-create v-model="fApi" :rule="rules" :option="options" />
        </el-main>
        <el-aside width="350px">
          <div class="form-create-designer-config">
            <!-- <form-create-designer-config :config-json="activeItem" /> -->
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, watch, toRefs, getCurrentInstance } from "@vue/composition-api";
import {
  useNavCloneItem,
  useNavClickCloneItem,
  useInitDraggableItem,
  useSetEmptyStatus,

  useSetVM
} from "./useFormCreateDesigner";
import {  useStateWithNav,
  useStateWithDraggables,
  useStateWithFormCreate,
  useStateWithPage } from './useState'

export default defineComponent({
  name: "FormCreateDesigner",
  setup() {
    const { proxy } = getCurrentInstance()
    /// 初始化item
    useInitDraggableItem()
    /// 设置当前的上下文 vm
    useSetVM(proxy)
    /// hack bug
    watch(() => useStateWithDraggables.mainList, (v) => {
      useSetEmptyStatus(v.length === 0)
    }, {
      deep: true
    })
    return {
      ...toRefs(useStateWithFormCreate),
      ...toRefs(useStateWithNav),
      ...toRefs(useStateWithDraggables),
      ...toRefs(useStateWithPage),
      // events
      useNavCloneItem,
      useNavClickCloneItem
    };
  },
});
</script>
