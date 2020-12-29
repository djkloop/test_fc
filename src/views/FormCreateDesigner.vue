<!--
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-29 16:26:48
 * @Description   : 头部注释
 * @FilePath      : /test_fc/src/views/Home.vue
-->
<style lang="scss">
li,
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.home {
  .form-widget {
    &-list {
      padding: 8px 0;
      width: 100%;
      height: 100%;
      ul {
        overflow: hidden;
        padding: 0 10px 10px;
        margin: 0;
        .form-widget-label {
          font-size: 12px;
          display: block;
          width: 47%;
          line-height: 26px;
          left: 0;
          float: left;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 1%;
          color: #333;
          border: 1px solid #f4f6fc;
          & > a {
            display: block;
            cursor: move;
            background: #f4f6fc;
            border: 1px solid #f4f6fc;
            .icon {
              margin-right: 6px;
              margin-left: 8px;
              font-size: 14px;
              display: inline-block;
              vertical-align: middle;
            }
            span {
              display: inline-block;
              vertical-align: middle;
            }
          }
          &:hover {
            color: #409eff;
            border: 1px dashed #409eff;
          }
        }
      }
    }
  }
  .d-main {
    height: 800px;
    border: 1px dashed #ccc;
  }
  .fc {
    &-drag {
      &-grid {
        &-row {
          .fc-drag-grid-box,
          .fc-drag-list {
            min-height: 60px;
            border: 1px dashed #d9d9d9;
            background: white;
          }
        }
      }
    }
  }
}

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
  <div class="home">
    <el-container>
      <el-aside width="350px">
        <div class="form-widget-list">
          <draggable
            :list="components"
            tag="ul"
            v-bind="draggableNavOptions"
            :clone="useNavCloneItem"
          >
            <li
              class="form-widget-label"
              :key="item.id"
              v-for="item in components"
            >
              <a>
                <i class="icon"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </draggable>
        </div>
      </el-aside>
      <el-main class="d-main">
        <div class="fc-form">
          <form-create v-model="fApi" :rule="rules" :option="options" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, toRefs } from "@vue/composition-api";
import { useStateWithNav, useStateWithDraggables, useStateWithFormCreate } from "./useState";
import { useNavCloneItem, useInitDraggableItem } from "./useFormCreateDesigner";
export default defineComponent({
  name: "FormCreateDesigner",
  components: {
    formCreate: window.formCreate.$form(),
  },
  setup() {
    useInitDraggableItem()
    return {
      ...toRefs(useStateWithFormCreate),
      ...toRefs(useStateWithNav),
      ...toRefs(useStateWithDraggables),
      useNavCloneItem
    };
  },
});
</script>
