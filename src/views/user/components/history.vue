<template>
  <div class="bigBox">
    <div class="left">
      <!-- <myVideo
        :src="url"
        :start-time="videoBeginTime"
      ></myVideo> -->
      <video
        :src="url"
        ref="videoRef"
        controls
        style="background-color: black"
      ></video>

      <div class="timeline">
        <div
          class="content"
          v-for="item in knowledgeList"
          @click="changeCurrentTime(item.startTime)"
        >
          <span class="title">{{ getCurrentTime(item.startTime) }}</span>
          <span class="text"> {{ item.text }} </span>
        </div>
      </div>
    </div>
    <div class="right">
      <span class="title">
        <img src="../../../assets/img/logo.png" alt="" />智通精灵
      </span>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="会议总结" name="first">
          <div class="rightContent" v-html="md.render(summary)"></div>
        </el-tab-pane>
        <el-tab-pane label="代办提醒" name="second"> </el-tab-pane>
        <el-tab-pane label="人员名单" name="third"> </el-tab-pane>
        <el-tab-pane label="导出" name="fourth"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { ElMessage, type TabsPaneContext } from "element-plus";
import { getKnowledgeByUrlAPI } from "@/apis/api";
import type { KnowledgeList } from "@/types/home";
import myVideo from "./video.vue";
import { getSummaryByVideoAPI } from "@/apis/api";

import MarkdownIt from "markdown-it";
let md: MarkdownIt = new MarkdownIt();

const activeName = ref("first");
const videoRef = ref<HTMLMediaElement>();

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const route = useRoute();

let url = ref<string>("");

const knowledgeList = ref<KnowledgeList>();

const getKnowledge = async () => {
  const res = await getKnowledgeByUrlAPI(url.value);

  if (res.data.code === 200) {
    knowledgeList.value = res.data.data;
  } else {
    ElMessage.error(res.data.message);
  }
};

const getCurrentTime = (time: string) => {
  // 1. 将字符串毫秒转换为数字
  const milliseconds = parseFloat(time);
  if (isNaN(milliseconds) || !isFinite(milliseconds)) {
    return "0:00"; // 非法值默认返回 0:00
  }

  // 2. 转换为秒（取整避免小数）
  const totalSeconds = Math.floor(milliseconds / 1000);

  // 3. 计算小时、分钟、秒
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // 4. 格式化为 HH:MM:SS 或 MM:SS
  if (hours > 0) {
    // 超过1小时：显示 HH:MM:SS（如 1:12:30）
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    // 不足1小时：显示 MM:SS（如 15:30）
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
};

const changeCurrentTime = (beginTime: string) => {
  // 1. 将字符串转换为数字（毫秒）
  const milliseconds = parseFloat(beginTime);

  // 2. 转换为秒（currentTime的单位是秒）
  const totalSeconds = milliseconds / 1000;

  // 3. 验证是否为有效数字
  if (!isNaN(totalSeconds) && isFinite(totalSeconds)) {
    videoRef.value!.currentTime = totalSeconds; // 设置视频时间
  } else {
    console.error("Invalid time value:", beginTime);
  }
};

const summary = ref("");

const getSummary = async () => {
  const res = await getSummaryByVideoAPI(url.value);

  if (res.data.code === 200) {
    console.log(res.data.data);

    summary.value = res.data.data;
  }
};

onMounted(() => {
  url.value = decodeURIComponent(route.params.url as string);
  getKnowledge();
  getSummary();
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
        cursor: pointer;

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

    .rightContent {
      max-width: 460px;
    }

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
