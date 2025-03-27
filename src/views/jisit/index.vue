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
      <span>{{ captions }}</span>
      <span>{{ transText }}</span>
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
          :action="getAction()"
          :before-upload="beforeUpload"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :headers="header"
          :on-change="changeFile"
          :limit="1"
        >
          <el-button
            circle
            type="primary"
            @click.stop="getMeetingResource"
            :icon="Refresh"
          ></el-button>
          <el-button type="primary">点击上传</el-button>
          <el-button @click.stop="aiGenerate" text="plain" type="primary"
            >AI会议资料总结</el-button
          >
          <template #tip>
            <div class="el-upload__tip">可选择文件上传</div>
          </template>
        </el-upload>
        <el-table :data="meetingResourceList" style="width: 100%">
          <el-table-column prop="name" label="文件名称"> </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" @click="downloadRes(scope.row.url)"
                >下载</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="智能总结">
        <div style="display: flex; align-items: center">
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
          <el-button text="plain" type="primary" @click="$router.push('/view')">导出成文档</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="代办事项"></el-tab-pane>

      <el-tab-pane label="会议设置">
        <el-form label-position="left" :data="meetingSettings">
          <!-- <el-form-item label="开启会议录制">
            <el-switch
              v-model="meetingSettings.isRecord"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item> -->
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
            <el-button text="plain" type="primary" @click="handleCopy"
              >链接分享</el-button
            >
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
import { ref, onMounted, onUnmounted } from "vue";
import {
  ElMessage,
  type UploadFile,
  type UploadProps,
  type UploadRawFile,
  type UploadUserFile,
} from "element-plus";
import { agentExecuteAPI, fileDownloadAPI } from "@/apis/ai/ai.ts";
import type { AgentMessageList } from "@/types/home";
import { SSEService } from "@/utils/sse";
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINTS } from "@/apis/ai/aiSse";
import { agentId, getHeaders } from "@/apis/ai/base";
import { copyText } from "vue3-clipboard";

import MarkdownIt from "markdown-it";
import { useRoute } from "vue-router";
import { getMeetingResourceAPI } from "@/apis/meeting.ts";
import { useMeetingStore } from "@/stores/meetingStore.ts";
import { Refresh } from "@element-plus/icons-vue";
import { baseUrl, ragUploadUrl } from "@/utils/baseUrl.ts";
import { uploadFileAPI } from "@/apis/rag.ts";
let md: MarkdownIt = new MarkdownIt();

const meetingStore = useMeetingStore();

const meetingSettings = ref({
  isRecord: false,
  isCaptions: true,
  isDistinct: false,
  isTransition: true,
});
//const isRecord = ref(false);
const dialogVisible = ref(false);
const captions = ref("");
const transText = ref("");

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

const aiGenerate = () => {};

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

let header = ref({});

const startAgent = async () => {
  //设置isloading

  isLoading.value = true;

  messageList.value.push({
    role: "user",
    content: sendText.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

  sendText.value = "";

  const sse = new SSEService();

  sse.connect(
    API_ENDPOINTS.EXECUTE,
    "POST",
    {
      sid: uuidv4(),
      id: agentId,
      input: sendText.value,
      stream: true,
    },
    (event) => {
      // console.log(event)
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header.value
  );
};

onMounted(async () => {
  header.value = await getHeaders();
});

// 传递
const stream = ref<MediaStream | null>(null);
const audioContextRef = ref<AudioContext | null>(null);
const processorRef = ref<ScriptProcessorNode | null>(null);
const wsRef = ref<WebSocket | null>(null);

// 初始化 AudioContext 和 ScriptProcessorNode
onMounted(async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    console.log("获取到流");
    stream.value = mediaStream;
    console.log(stream.value.getAudioTracks());

    // 确保 stream.value 赋值后再初始化 WebSocket
    if (stream.value) {
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(stream.value);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event: AudioProcessingEvent) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const pcmData = convertFloat32ToPCM(inputData);
        if (wsRef.value && wsRef.value.readyState === WebSocket.OPEN) {
          wsRef.value.send(pcmData);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      audioContextRef.value = audioContext;
      processorRef.value = processor;

      // 初始化 WebSocket
      wsRef.value = new WebSocket("ws://83.229.122.190:8080/");
      wsRef.value.onopen = () => {
        console.log("WebSocket 连接已建立");
      };
      wsRef.value.onmessage = (event: MessageEvent) => {
        console.log(JSON.parse(event.data));

        let data = JSON.parse(event.data);

        if (data.action === "result" && meetingSettings.value.isCaptions) {
          // 显示字幕
          let content = JSON.parse(data.data);
          captions.value = content.src;
          if (meetingSettings.value.isTransition) transText.value = content.dst;

          // captions.value += content.src ? content.src : "";
          // if (meetingSettings.value.isTransition)
          //   transText.value += content.dst ? content.dst : "";
        }
      };
      wsRef.value.onerror = (error: Event) => {
        console.error("WebSocket 错误:", error);
      };
      wsRef.value.onclose = () => {
        console.log("WebSocket 连接已关闭");
      };
    }
  } catch (error) {
    if ((error as Error).name === "NotAllowedError") {
      alert("请允许网站访问麦克风");
    } else {
      console.error("Error accessing microphone", error);
    }
  }
});

// 清理资源
onUnmounted(() => {
  if (wsRef.value) {
    wsRef.value.close();
  }
  if (audioContextRef.value) {
    audioContextRef.value.close();
  }
});

// 将 Float32Array 转换为 16bit PCM
const convertFloat32ToPCM = (input: Float32Array): Int16Array => {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i])); // 限制范围在 -1 到 1
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff; // 转换为 16bit
  }
  return output;
};

const route = useRoute();

const handleCopy = () => {
  copyText(
    "http://www.tccwzfy.cloud/" + route.params.id,
    undefined,
    (e: any) => {
      if (e) {
        ElMessage.error("复制会议链接失败");
      } else {
        ElMessage.success("复制会议链接成功");
      }
    }
  );
};

// 会议资料处理

const meetingResourceList = ref([]);

const currentFile = ref();

const changeFile = (uploadFile: UploadFile) => {
  console.log(uploadFile);
  currentFile.value = uploadFile.raw;
};

const downloadRes = async (url: string) => {
  let response = await fetch(url);
  let blob = await response.blob();
  let objectUrl = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = objectUrl;
  a.download = "filename"; // 下载文件的名字
  a.click();
  a.remove();
};

const beforeUpload = async (rawFile: UploadRawFile) => {
  //处理上传之前的逻辑 先上传到rag那边
  //console.log(rawFile);

  let data = new FormData();
  data.append("files", currentFile.value);
  data.append("process_now", "true");

  const res = await uploadFileAPI(data);

  console.log(res);

  currentName.value = rawFile.name;
};

const currentName = ref("");

const getAction = () => {
  return (
    baseUrl +
    "/oss/meeting/resource" +
    "?meetingId=" +
    meetingStore.meetingSettings?.id +
    "&name=" +
    currentName.value
  );
};

const getMeetingResource = async () => {
  const res = await getMeetingResourceAPI(meetingStore.meetingSettings!.id!);

  if (res.data.code === 200) {
    meetingResourceList.value = res.data.data;
  } else {
    ElMessage.error("获取失败");
  }
};

onMounted(() => {
  getMeetingResource();
});
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
    flex-direction: column;
    align-items: center;
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
