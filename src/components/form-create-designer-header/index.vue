<!--
 * @Author        : djkloop
 * @Date          : 2020-12-29 16:43:05
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-31 17:53:51
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/components/form-create-designer-header/index.vue
-->
<template>
  <div class="form-create-designer-header__wrapper">
    <div class="form-create-designer-header__wrapper__left">
      <img src="@/assets/images/form-create-logo.png">
      <span>FormCreateDesignerWithElement</span>
    </div>
    <div class="form-create-designer-header__wrapper__center">
      {{ json }}
    </div>
    <div class="form-create-designer-header__wrapper__right">
      <el-button size="mini" type="primary" :loading="loading" @click="useFetchAllConfigJsonTemplate">全局类型配置json</el-button>
    </div>
  </div>
</template>

<script>
import { toRefs } from '@vue/composition-api'
import { useFetchAllConfigJsonTemplate, useHeaderState } from './useFormCreateDesignerHeader'
export default {
  name: 'form-create-designer-header',
  setup() {
    useFetchAllConfigJsonTemplate()

    return {
      ...toRefs(useHeaderState),
      useFetchAllConfigJsonTemplate
    }
  }
}
</script>

<style lang="scss">
@import "./form-create-designer-header.scss";
</style>