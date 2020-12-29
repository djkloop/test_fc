<!--
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-29 18:51:53
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

.fc-form,
.el-form {
  height: 100%;
  & > .el-row {
    height: 100%;
    .fc-drag-main {
      height: 100%;
      .fc-drag-transition {
        height: 100%;
      }
    }
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
          123
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getCurrentInstance, toRefs, watch } from "@vue/composition-api";
import { useStateWithNav, useStateWithDraggables, useStateWithFormCreate, useStateWithPage } from "./useState";
import { useNavCloneItem, useInitDraggableItem, useSetEmptyStatus, useSetVM } from "./useFormCreateDesigner";
export default {
  name: "FormCreateDesigner",
  components: {
    formCreate: window.formCreate.$form(),
  },
  setup() {
    const { proxy } = getCurrentInstance()
    ///
    useInitDraggableItem()
    ///
    useSetVM(proxy)
    ///
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
      useNavCloneItem
    };
  },
};
</script>
