<!--
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2021-02-02 18:05:53
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
        <el-aside width="350px" >
          <template v-if="!loading">
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
          </template>
          <template v-else>
            <content-loader
            :width="350"
            :height="600"
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="20" y="20" rx="0" ry="0" width="145" height="32" />
            <rect x="20" y="65" rx="0" ry="0" width="145" height="32" />
            <rect x="180" y="20" rx="0" ry="0" width="145" height="32" />
            <rect x="180" y="65" rx="0" ry="0" width="145" height="32" />
            <rect x="20" y="106" rx="0" ry="0" width="145" height="32" />
            <rect x="180" y="106" rx="0" ry="0" width="145" height="32" />
          </content-loader>
          </template>
        </el-aside>
        <el-main class="form-create-designer-main">
          <div v-if="mainList.length === 0" class="common-empty-text">
            从左侧选择控件添加
          </div>
          <form-create v-model="fApi" :rule="rules" :option="options" />
        </el-main>
        <el-aside width="350px">
          <template v-if="loading">
            <content-loader
              :width="350"
              :height="600"
              :speed="2"
              primaryColor="#f3f3f3"
              secondaryColor="#ecebeb"
            >
              <template v-for="(item) in 2">
                <rect :key="`item_fdsfs${item + 111111}`" x="10" :y="item === 1 ? 20 : 66 + item * 20" width="7" height="66" />
                <rect  :key="`itemsffsd_${item + 12222}`" x="10" :y="item === 1 ? 20 : 66 + item * 20" width="320" height="8" />
                <rect :key="`item_sasa${item + 2}`"  x="10" :y="item === 1 ? 78 : 66 * item + item * 16" width="320" height="8" />
                <rect :key="`item_fsdfds${item + 3}`"  x="330" :y="item === 1 ? 20 : 66 + item * 20" width="7" height="66" />
                <rect :key="`item_dsfs${item + 4}`"  x="25" :y="item === 1 ? 35 : 36 * item + item * 24" width="150" height="36" />
                <rect :key="`item_fdfsf${item + 5}`"  x="180" :y="item === 1 ? 37 : 37 * item + item * 24" width="140" height="10" />
                <rect :key="`item_dsfsfsd${item + 6}`"  x="180" :y="item === 1 ? 57 : 57 * item + item * 15" width="140" height="10" />
              </template>
            </content-loader>
          </template>
          <template v-else>
            <div class="form-create-designer-config">
              <div class="form-create-designer-config__item">
                <form-create-designer-config :main-fapi="fApi" :active-model-with-config-item="activeModelWithConfigItem" />
              </div>
              <div class="form-create-designer-config__global">
                <el-button @click="() => closeDrawer = !closeDrawer" plain>全局FormCreate配置</el-button>
              </div>
            </div>
          </template>
        </el-aside>
      </el-container>
    </el-container>
    <el-drawer
      title="全局FormCreate配置"
      destroy-on-close
      append-to-body
      :modal="false"
      custom-class='form-create-config-drawer'
      size="35%"
      :wrapper-closable="false"
      :visible.sync="closeDrawer"
      :before-close="useConfigClose">
      <div class="form-create-config-drawer__body">
        <el-scrollbar class="form-create-config-drawer__body__list">
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              表单尺寸：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-radio-group v-model="options.form.size" size="mini">
                <el-radio-button label="large">特大</el-radio-button>
                <el-radio-button label="medium">中等</el-radio-button>
                <el-radio-button label="small">小</el-radio-button>
                <el-radio-button label="mini">迷你</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否是行内模式：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.inline" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              标签的位置：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-radio-group v-model="options.form.labelPosition" size="mini">
                <el-radio-button label="right">right</el-radio-button>
                <el-radio-button label="left">left</el-radio-button>
                <el-radio-button label="top">top</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否显示必填星号：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.hideRequiredAsterisk" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              label全局宽度：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-input v-model="options.form.labelWidth" size="mini"></el-input>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否显示校验信息：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.showMessage" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              行内显示校验信息：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.inlineMessage" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否行显示校验图标：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.statusIcon" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否懒验证：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.validateOnRuleChange" size="mini"></el-switch>
            </div>
          </div>
          <div class="form-create-config-drawer__global__item">
            <div class="form-create-config-drawer__global__item_title">
              是否置灰：
            </div>
            <div class="form-create-config-drawer__global__item_content">
              <el-switch v-model="options.form.disabled" size="mini"></el-switch>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="form-create-config-drawer__submit">
        <el-button>更改配置</el-button>
        <el-button>恢复默认</el-button>
        <el-button>取消更改</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { defineComponent, toRefs, getCurrentInstance } from "@vue/composition-api";
import {
  useNavCloneItem,
  useNavClickCloneItem,
  useInitDraggableItem,
  useConfigClose,
  useSetVM
} from "./useFormCreateDesigner";
import {
  useStateWithNav,
  useStateWithDraggables,
  useStateWithFormCreate,
  useStateWithPage
} from './useState'
import { useHeaderState } from '@/components/form-create-designer-header/useState'

export default defineComponent({
  name: "FormCreateDesigner",
  setup() {
    const { proxy } = getCurrentInstance()
    /// 初始化item
    useInitDraggableItem()
    /// 设置当前的上下文 vm
    useSetVM(proxy)

    return {
      ...toRefs(useStateWithFormCreate),
      ...toRefs(useHeaderState),
      ...toRefs(useStateWithNav),
      ...toRefs(useStateWithDraggables),
      ...toRefs(useStateWithPage),
      // events
      useNavCloneItem,
      useNavClickCloneItem,
      useConfigClose
    };
  },
});
</script>
