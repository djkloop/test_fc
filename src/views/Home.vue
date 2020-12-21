<!--
 * @Author        : djkloop
 * @Date          : 2020-12-21 16:09:07
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-12-21 18:22:07
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
            v-bind="draggableOptions"
            :clone="useFormatDragItem"
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
import { defineComponent, reactive, toRefs, ref } from "@vue/composition-api";
import { cloneDeep, uniqueId } from "lodash";
import classnames from "classnames";

export default defineComponent({
  name: "Home",
  components: {
    formCreate: window.formCreate.$form(),
  },
  setup() {
    const navStates = reactive({
      components: [
        {
          id: 1,
          label: "el-row",
          lib_type: "row",
        },
        {
          id: 2,
          label: "el-input",
          lib_type: "input",
        },
      ],
      draggableOptions: {
        group: { name: "dragGroup", pull: "clone", put: false },
        sort: false,
        animation: 180,
        draggable: ".form-widget-label",
        ghostClass: "moving",
      },
    });

    const formStates = reactive({
      fApi: {},
      rules: [],
      options: {
        submitBtn: false,
        resetBtn: false,
      },
    });

    const draggableOptions = ref({
      group: "dragGroup",
      ghostClass: "fc-drage-moving",
      animation: 180,
    });

    /// generate unique id
    const useUniqueId = (item) => {
      item._id = uniqueId("drag_key_id_");
    };

    /// generate field
    const useAutoField = () => {
      return "field_" + Math.random().toString(36).substring(3, 11);
    };

    /// common wrapper drag item
    const useWrapperDrag = () => {
      const otherList = ref([]);
      return {
        type: "draggable",
        props: {
          list: otherList.value,
          tag: "div",
        },
        attrs: {
          ...draggableOptions.value,
          clone: item => {
            /******************************************* */
            /* clone 的时候一定要深拷贝 要不然一堆bug         */
            /******************************************* */
            const cloneItem = cloneDeep(item)
            const onlyField = useAutoField();
            cloneItem["field"] = onlyField;
            cloneItem["title"] = onlyField;
            cloneItem["id"] = onlyField;
            console.log(cloneItem, " other-clone");
            return cloneItem
          }
        },
        class: "fc-drag-main fc-drag-grid-box",
        children: [
          {
            type: "transition-group",
            props: {
              name: "fc-drag-list",
              tag: "div",
            },
            class: "fc-drag-transition fc-drag-list",
            children: otherList.value,
            native: true,
          },
        ],
        on: {
          start: () => {
            console.log(' <------')
            return false
          },
          add: (item) => {
            console.log(item, " other-add");
            return false
          },
          change:() => {
            console.log('__-change')
            return false
          },
        },
      };
    };

    /// transfer - row
    const useRow = (item) => {
      item["type"] = "el-row";
      item["class"] = classnames("fc-drag-grid-row");
      item["children"] = [
        {
          type: "el-col",
          props: { span: 12 },
          children: [useWrapperDrag()],
        },
        {
          type: "el-col",
          props: { span: 12 },
          children: [useWrapperDrag()],
        },
      ];
    };

    /// transfer - input
    const useInput = (item) => {
      item["type"] = "el-input";
      const onlyField = useAutoField();
      item["field"] = onlyField;
      item["title"] = onlyField;
      item["id"] = onlyField;
    };

    /// format rules
    const useFormatDragItem = (item) => {
      const cloneItem = cloneDeep(item);
      useUniqueId(cloneItem);
      switch (cloneItem.lib_type) {
        case "row":
          useRow(cloneItem);
          break;
        case "input":
          useInput(cloneItem);
          break;
        default:
          break;
      }
      return cloneItem;
    };

    /// main data list
    const baseList = ref([]);
    const draggableMainOptions = ref({
      group: "dragGroup",
      ghostClass: "fc-drage-moving",
      animation: 180,
    });
    /// init draggable component
    const initDraggableItem = reactive({
      type: "draggable",
      props: {
        list: baseList.value,
        tag: "div",
      },
      attrs: {
        ...draggableMainOptions.value,
      },
      class: "fc-drag-main",
      children: [
        {
          type: "transition-group",
          props: {
            name: "fc-drag-list",
            tag: "div",
          },
          class: "fc-drag-transition",
          children: baseList.value,
          native: true,
        },
      ],
      on: {
        add: () => {
          console.log(baseList.value, " main-add");
          console.log(baseList, " lllll");
        },
        clone: () => {
          console.log(baseList.value, " main-clone");
        },
      },
    });
    formStates.rules.push(initDraggableItem);

    return {
      ...toRefs(formStates),
      ...toRefs(navStates),
      useFormatDragItem,
    };
  },
});
</script>
