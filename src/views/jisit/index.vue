<template>
  <div class="bigBox">
    <MyReactComponent />
    <div class="affixed">
      <el-button
        circle
        @click="dialogVisible = true"
        style="width: 80px; height: 80px"
        plain=""
      >
        <img
          style="width: 70px; height: 70px"
          src="../../assets/img/logo.png"
          alt=""
        />
      </el-button>
    </div>
    <div v-if="meetingSettings.isCaptions" class="captions">
      <span>字幕加载中……</span>
    </div>
  </div>

  <el-dialog
    draggable="true"
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :modal="false"
    :width="800"
    style="min-height: 500px"
    @open="handleOverlay"
    title="智通精灵"
  >
    <el-tabs tab-position="left" style="height: 500px" class="demo-tabs">
      <el-tab-pane label="智通会话">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <div class="messagesBox">
            <div class="message" v-for="(item, index) in messageList">
              <div v-if="item.role === 'assistant'" class="aiMessage">
                <img src="../../assets/img/logo.png" alt="" />

                <span
                  v-if="isLoading && index === messageList.length - 1"
                  class="message"
                >
                  <img
                    style="
                      padding: 0 10px;
                      width: 20px;
                      height: 20px;
                      transform: scale(3);
                    "
                    src="../../assets/loading.gif"
                    alt=""
                  />
                </span>
                <span v-else v-html="md.render(item.content)"></span>
              </div>

              <div v-else class="myMessage">
                <span>{{ item.content }}</span>
              </div>
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
              <el-button type="primary" @click="startAgent">发送</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资料下载">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="/open/api/v2/agent/file/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :headers="header"
        >
          <el-button type="primary">点击上传</el-button>
          <el-button @click.stop="aiGenerate" text="plain" type="primary"
            >AI获取会议资源</el-button
          >
          <template #tip>
            <div class="el-upload__tip">可选择文件上传</div>
          </template>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane label="智能总结">
        <button type="button" class="button">
          <span class="fold"></span>

          <div class="points_wrapper">
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
          </div>

          <span class="inner"
            ><svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
            >
              <polyline
                points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
              ></polyline></svg
            >AI 智能总结</span
          >
        </button>
      </el-tab-pane>

      <el-tab-pane label="代办事项"> </el-tab-pane>

      <el-tab-pane label="会议设置">
        <el-form label-position="left" :data="meetingSettings">
          <el-form-item label="开启会议录制">
            <el-switch
              v-model="meetingSettings.isRecord"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="实时字幕">
            <el-switch
              v-model="meetingSettings.isCaptions"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
            <div v-if="meetingSettings.isCaptions" style="margin-left: 20px">
              <span style="margin-right: 20px">是否开启翻译</span>
              <el-switch
                v-model="meetingSettings.isTransition"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </el-form-item>

    
          <el-form-item label="分享会议">
            <el-button text="plain" type="primary">链接分享</el-button>
          </el-form-item>
          <el-form-item label="签到">
            <el-button type="primary" text="plain">查看已到</el-button>
            <el-button type="primary" text="plain">导出成excel</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="推荐会议"></el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { applyReactInVue } from "veaury";
import myReactComponent from "./jisit.tsx"; // 注意组件命名规范
import { ref, onMounted } from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import { agentExecuteAPI, fileDownloadAPI } from "@/apis/ai/ai.ts";
import { appKey, getSign } from "@/apis/ai/base.ts";
import type { AgentMessageList } from "@/types/home";

import MarkdownIt from "markdown-it";
let md: MarkdownIt = new MarkdownIt();

const meetingSettings = ref({
  isRecord: false,
  isCaptions: false,
  isDistinct: false,
  isTransition: false,
});
//const isRecord = ref(false);
const dialogVisible = ref(false);

const MyReactComponent = applyReactInVue(myReactComponent);

// 穿透遮罩层
function handleOverlay() {
  //获取对话框Dom
  let overlay = <HTMLElement>document.querySelector(".is-draggable");
  // 设置pointerEvents='auto',使对话框可以正常操作
  overlay!.style.pointerEvents = "auto";
  //通过对话框Dom获取遮罩层Dom,修改其pointerEvents = 'none',使其他区域可正常操作
  //第一层遮罩层
  let overlayFa = <HTMLElement>overlay!.parentNode;
  overlayFa.style.pointerEvents = "none";
  //第二层遮罩层
  let overlayGfa = overlay!.parentNode!.parentNode;
  overlayGfa.style.pointerEvents = "none";
}

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = async (file) => {
  console.log(file);
  //下载

  const res = await fileDownloadAPI(file.url!);

  console.log(res.data);
};

const handleSuccess = (response: any) => {
  console.log(response.tid);
  fileList.value[fileList.value.length - 1].url = response.data;
};

const header = ref({
  appKey: appKey,
  sign: "",
});

const aiGenerate = () => {};

const start = async () => {
  header.value.sign = await getSign();
};

onMounted(() => {
  start();
});

// 关于智通会话的代码
const sendText = ref("");
const isLoading = ref(false);

const messageList = ref<AgentMessageList>([
  {
    role: "user",
    content: "你好",
  },
  {
    role: "assistant",
    content: "你好我是你的ai小助手",
  },
]);

// 解码包含Unicode转义序列的字符串
function decodeUnicode(str: string) {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, function (match) {
    return String.fromCharCode(parseInt(match.substr(2), 16));
  });
}

let arry: string[] = []; // 存储待渲染的字符串
let isRendering = false; // 标记是否正在渲染

function handleRender(newText: string) {
  arry.push(newText); // 将新内容添加到队列

  // 如果当前没有正在渲染的任务，则开始渲染
  if (!isRendering) {
    renderNext();
  }
}

/**
 * 逐步渲染队列中的文字内容
 */
function renderNext() {
  if (arry.length === 0) {
    isRendering = false; // 如果没有更多内容，停止渲染
    return;
  }

  isRendering = true; // 标记为正在渲染

  const currentText = arry.shift()!; // 取出队列中的第一段文字
  const chars = Array.from(currentText); // 将字符串拆分为字符数组
  let index = 0; // 当前渲染的字符索引
  const interval = 50; // 渲染间隔时间（毫秒）
  const step = 3; // 每次渲染的字符数

  // 使用 setInterval 逐步渲染
  const timer = setInterval(() => {
    if (index >= chars.length) {
      // 如果当前字符串渲染完成，清除定时器并处理下一段文字
      clearInterval(timer);
      renderNext(); // 递归调用，处理下一段文字
      return;
    }

    // 每次渲染 step 个字符
    const chunk = chars.slice(index, index + step).join("");
    // console.log(chunk); // 这里可以替换为实际的 UI 更新逻辑
    setTimeout(() => {
      messageList.value[messageList.value.length - 1].content += chunk;
    });
    index += step; // 更新索引
  }, interval);
}

const startAgent = async () => {
  //设置isloading

  isLoading.value = true;

  let str = sendText.value;

  messageList.value.push({
    role: "user",
    content: sendText.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

  sendText.value = "";

  const res = await agentExecuteAPI(str);

  isLoading.value = false;

  console.log(
    res.data.data.session.messages[res.data.data.session.messages.length - 1]
      .content
  );

  let decodeContent = decodeUnicode(
    res.data.data.session.messages[res.data.data.session.messages.length - 1]
      .content
  );
  // messageList.value[messageList.value.length-1].content+=res.data.data.session.messages[res.data.data.session.messages.length-1].content
  handleRender(decodeContent);
};
</script>

<style lang="scss" scoped>
.bigBox {
  height: 100vh;
  width: 100vw;
  position: relative;

  .affixed {
    position: absolute;

    right: 80px;
    bottom: 80px;
  }

  .captions {
    position: absolute;
    bottom: 80px;
    width: 100vw;
    display: flex;
    justify-content: center;

    span {
      color: white;
      margin: 0 auto;
      font-size: 20px;
    }
  }
}

.messagesBox {
  min-height: 380px;
  height: 380px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 20px;
  box-sizing: border-box;

  .date {
    color: $primary-gray-text-color;
    font-size: 14px;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
  }

  .aiMessage {
    display: flex;
    justify-content: left;

    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    span {
      background-color: $primary-message-background-color;
      margin-right: 60px;
      padding: 10px;
      border-radius: 0px 10px 10px 10px;
    }
  }

  .myMessage {
    display: flex;
    justify-content: right;

    span {
      background-color: $primary-color;
      color: white;
      margin-left: 60px;
      padding: 10px;
      border-radius: 10px 10px 0px 10px;
    }
  }
}
.inputBox {
  // background-color: red;
  position: relative;

  //height: 100px;

  .submit {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
/* From Uiverse.io by ilkhoeri */
.button {
  --h-button: 48px;
  --w-button: 102px;
  --round: 0.75rem;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.25s ease;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
  border-radius: var(--round);
  border: none;
  outline: none;
  padding: 12px 18px;
}
.button::before,
.button::after {
  content: "";
  position: absolute;
  inset: var(--space);
  transition: all 0.5s ease-in-out;
  border-radius: calc(var(--round) - var(--space));
  z-index: 0;
}
.button::before {
  --space: 1px;
  background: linear-gradient(
    177.95deg,
    rgba(255, 255, 255, 0.19) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.button::after {
  --space: 2px;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
}
.button:active {
  transform: scale(0.95);
}

.fold {
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  height: 1rem;
  width: 1rem;
  display: inline-block;
  transition: all 0.5s ease-in-out;
  background: radial-gradient(
    100% 75% at 55%,
    rgba(223, 113, 255, 0.8) 0%,
    rgba(223, 113, 255, 0) 100%
  );
  box-shadow: 0 0 3px black;
  border-bottom-left-radius: 0.5rem;
  border-top-right-radius: var(--round);
}
.fold::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 150%;
  height: 150%;
  transform: rotate(45deg) translateX(0%) translateY(-18px);
  background-color: #e8e8e8;
  pointer-events: none;
}
.button:hover .fold {
  margin-top: -1rem;
  margin-right: -1rem;
}

.points_wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.points_wrapper .point {
  bottom: -10px;
  position: absolute;
  animation: floating-points infinite ease-in-out;
  pointer-events: none;
  width: 2px;
  height: 2px;
  background-color: #fff;
  border-radius: 9999px;
}
@keyframes floating-points {
  0% {
    transform: translateY(0);
  }
  85% {
    opacity: 0;
  }
  100% {
    transform: translateY(-55px);
    opacity: 0;
  }
}
.points_wrapper .point:nth-child(1) {
  left: 10%;
  opacity: 1;
  animation-duration: 2.35s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(2) {
  left: 30%;
  opacity: 0.7;
  animation-duration: 2.5s;
  animation-delay: 0.5s;
}
.points_wrapper .point:nth-child(3) {
  left: 25%;
  opacity: 0.8;
  animation-duration: 2.2s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(4) {
  left: 44%;
  opacity: 0.6;
  animation-duration: 2.05s;
}
.points_wrapper .point:nth-child(5) {
  left: 50%;
  opacity: 1;
  animation-duration: 1.9s;
}
.points_wrapper .point:nth-child(6) {
  left: 75%;
  opacity: 0.5;
  animation-duration: 1.5s;
  animation-delay: 1.5s;
}
.points_wrapper .point:nth-child(7) {
  left: 88%;
  opacity: 0.9;
  animation-duration: 2.2s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(8) {
  left: 58%;
  opacity: 0.8;
  animation-duration: 2.25s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(9) {
  left: 98%;
  opacity: 0.6;
  animation-duration: 2.6s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(10) {
  left: 65%;
  opacity: 1;
  animation-duration: 2.5s;
  animation-delay: 0.2s;
}

.inner {
  z-index: 2;
  gap: 6px;
  position: relative;
  width: 100%;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s ease-in-out;
}

.inner svg.icon {
  width: 18px;
  height: 18px;
  transition: fill 0.1s linear;
}

.button:focus svg.icon {
  fill: white;
}
.button:hover svg.icon {
  fill: transparent;
  animation: dasharray 1s linear forwards, filled 0.1s linear forwards 0.95s;
}
@keyframes dasharray {
  from {
    stroke-dasharray: 0 0 0 0;
  }
  to {
    stroke-dasharray: 68 68 0 0;
  }
}
@keyframes filled {
  to {
    fill: white;
  }
}
</style>
