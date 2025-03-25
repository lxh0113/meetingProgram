<template>
  <div class="bigBox">
    <div class="left">
      <video :src="url" crossorigin="anonymous" controls></video>
      <div class="timeline">
        <div class="content" v-for="item in 10">
          <span class="title">12:00</span>
          <span class="text"> 这段描述了xxxxx </span>
        </div>
      </div>
    </div>
    <div class="right">
      <span class="title">
        <img src="../../../assets/img/logo.png" alt="" />智通精灵
      </span>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="会议总结" name="first"> </el-tab-pane>
        <el-tab-pane label="代办提醒" name="second"> </el-tab-pane>
        <el-tab-pane label="人员名单" name="third"> </el-tab-pane>
        <el-tab-pane label="导出" name="fourth"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const route = useRoute();

let url = ref<string>("");

onMounted(() => {
  url.value = decodeURIComponent(route.params.url as string);
});


</script>

<style lang="scss" scoped>
.bigBox {
  max-width: 100vw;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: calc(100vw - 540px);

    video {
      max-height: 600px;
      flex: 1;
    }

    .timeline {
      overflow-x: scroll;
      min-height: 240px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;

      .content {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 20px;
        border: 1px solid $primary-border-color;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
        border-radius: 10px;
        min-width: 240px;
        margin-right: 20px;

        .title {
          color: $primary-color;
          font-weight: bold;
          font-size: large;
        }

        .text {
          color: $primary-gray-text-color;
        }
      }
    }
  }

  .right {
    min-width: 500px;
    // border: 1px solid $primary-border-color;
    // border-radius: 10px;
    // box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    margin-left: 20px;

    > .title {
      color: $primary-color;
      font-weight: bold;
      font-size: large;
      display: flex;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
