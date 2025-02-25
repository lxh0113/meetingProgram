<template>
  <div class="myEditorBox">
    <Toolbar
      class="myToolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
    />
    <div class="content">
      <div class="title" v-if="!props.isReply">
        <input v-model="titleText" type="text" placeholder="请输入标题" />
        <el-button
          size="large"
          style="margin-right: 20px"
          type="success"
          @click="publish"
          >发布</el-button
        >
      </div>
      <Editor
        class="myEditor"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
      />
    </div>
    <el-button
      v-if="props.isReply"
      size="large"
      style="margin-top: 20px"
      type="primary"
      @click="publish"
      >发布</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { defineEmits } from "vue";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 标题
const titleText = ref("");

// 内容 HTML
const valueHtml = ref("<p></p>");

// 模拟 ajax 异步获取内容
onMounted(() => {});

const toolbarConfig = {};
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    /* 菜单配置，下文解释 */
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const emit = defineEmits(["getContent"]);

const publish = () => {
  emit("getContent", {
    title: titleText.value,
    content: valueHtml.value,
  });
};

interface Props {
  title?: string;
  content?: string;
  isReply?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "这是一个标题",
  content: "",
});

watch(props, (old, newValue) => {
  valueHtml.value = newValue.content;
  titleText.value = newValue.title;
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.myEditorBox {
  display: flex;
  flex-direction: column;
  // justify-content: space-between;

  .myToolbar {
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.05) 0px 8px 32px;
  }

  .content {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    border: 1px solid $primary-border-color;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.05) 0px 8px 32px;
    margin-top: 20px;
    box-sizing: border-box;

    .title {
      height: 60px;
      width: 100%;
      overflow: hidden;
      // background-color: red;
      display: flex;
      align-items: center;

      input {
        height: 60px;
        border: none;
        border-radius: 20px;
        box-sizing: border-box;
        padding: 20px;
        font-size: 20px;
        font-weight: bold;
        outline: none;
        // width: 100%;
        flex: 1;
      }
    }

    .myEditor {
      flex: 1;
      min-height: calc(100vh - 300px);
      max-height: calc(100vh - 300px);
      box-sizing: border-box;
      // margin-top: 20px;
      overflow-y: scroll;
    }
  }
}
</style>
