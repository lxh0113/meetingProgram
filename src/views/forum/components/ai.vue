<template>
  <div class="aiBox">
    <span class="title"> AI工具 </span>
    <div class="content">
      <div class="aiMessage">
        <el-avatar :size="50">ai</el-avatar>
        <div class="message">
          请问有什么需要帮助的吗？需要我为你预定会议或者其他吗
        </div>
      </div>
      <div class="myMessage">
        <div class="message">谢谢，不必了</div>
      </div>
    </div>
    <div class="inputBox">
      <el-input
        rows="5"
        resize="none"
        type="textarea"
        v-model="sendText"
        placeholder="请输入你想输入的问题"
      >
      </el-input>
      <div class="submit">
        <el-button type="primary">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const sendText = ref("");
</script>

<style lang="scss" scoped>
.aiBox {
  width: 100%;
  height: 100%;
  border: 1px solid $primary-border-color;
  border-radius: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
  box-sizing: border-box;
//   padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  min-height: calc(100vh - 140px);

  .title {
    background-color: $primary-color;
    color: white;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
    // line-height: 50px;
    padding: 20px;
  }

  .content {
    flex: 1;
    margin: 0px 20px;
    overflow-y: scroll;


    .aiMessage {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;

      .message {
        background-color: $primary-message-background-color;
        border-radius: 0px 10px 10px 10px;
        padding: 10px;
        margin-left: 20px;
      }
    }

    .myMessage {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      margin-left: 70px;

      .message {
        background-color: $primary-color;
        color: white;
        padding: 10px;
        border-radius: 10px 10px 0px 10px;
      }
    }
  }

  .inputBox {
    // background-color: red;
    position: relative;
    margin: 20px;

    .submit {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}
</style>
