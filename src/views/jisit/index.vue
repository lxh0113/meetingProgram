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
    :width="900"
    style="min-height: 500px"
    @open="handleOverlay"
    title="智通精灵"
  >
    <el-tabs tab-position="left" style="min-height: 700px" class="demo-tabs">
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
              <el-popover placement="top" :width="400" trigger="hover">
                <template #reference>
                  <el-button type="primary" @click="startAgent">提问</el-button>
                </template>
                <el-button type="primary" @click="">rag检索</el-button>
                <el-button type="primary" @click="startCreation"
                  >文档创作</el-button
                >
                <el-button type="primary" @click="startTrans"
                  >文档翻译</el-button
                >
              </el-popover>
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
          <button type="button" @click="getMeetingSummary" class="button">
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
          <el-button text="plain" type="primary" @click="toView"
            >导出成文档</el-button
          >
          <div v-if="aiSummary" class="loadding">
            <img
              style="width: 80px; height: 80px"
              src="../../assets/img/ai.gif"
              alt=""
            />
          </div>
        </div>
        <div
          v-if="!aiSummary"
          style="margin-top: 20px"
          v-html="md.render(summary)"
        ></div>
      </el-tab-pane>

      <el-tab-pane label="代办事项">
        <el-button type="primary" @click="getCurrentToDo"
          >获取当天代办</el-button
        >
        <el-button type="primary" @click="isAdd = true">添加代办</el-button>
        <div v-if="isAdd" style="display: flex; margin: 20px 0">
          <el-input
            v-model="addTodoData.title"
            placeholder="请输入标题"
          ></el-input>
          <el-input
            v-model="addTodoData.content"
            style="margin: 0 20px"
            placeholder="请输入内容"
          ></el-input>
          <el-button type="plain" @click="isAdd = false">取消</el-button>
          <el-button type="primary" @click="addTodo">确认</el-button>
        </div>
        <div>
          <el-calendar v-if="isShow" v-model="currentDay">
            <template #date-cell="{ data }">
              <p :class="data.isSelected ? 'is-selected' : ''">
                {{ data.day.split("-").slice(1).join("-") }}
                {{ data.isSelected ? "✔️" : "" }}
              </p>
              <p
                style="margin-top: 20px; color: red"
                v-if="toDoNumber(data.day)"
              >
                {{ toDoNumber(data.day) }}条代办
              </p>
              <!-- <p v-for="item in isHave(data.day)">{{ item.title }}</p> -->
            </template>
          </el-calendar>

          <el-timeline-item
            center
            style="margin: 0 20px"
            v-for="(activity, index) in viewCurrentList"
            :key="index"
            :timestamp="activity.createTime"
            placement="top"
          >
            <div
              class="card"
              style="
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
              "
            >
              <div class="text" style="margin-right: 20px">
                <h4 class="itemTitle" style="font-size: 16px">
                  {{ activity.title }}
                </h4>
                <p style="margin-top: 20px">{{ activity.content }}</p>
              </div>
              <el-button
                v-if="activity.status === '0'"
                @click="finish(activity.id)"
                type="primary"
                >完成</el-button
              >
            </div>
          </el-timeline-item>
        </div>
      </el-tab-pane>

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
            <el-button type="primary" text="plain" @click="getSign"
              >查看已到</el-button
            >
            <el-button type="primary" text="plain" @click="toExcel"
              >导出成excel</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="[...signTableData, ...noSignTableData]"
          ref="exportTableRef"
          style="width: 100%"
        >
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column label="头像">
            <template #default="scope">
              <el-avatar :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="签到情况">
            <template #default="scope">
              {{ scope.$index < signTableData.length ? "已到" : "未到" }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="发言稿">
        <el-form :data="speechData" label-width="80px">
          <el-form-item label="核心目标">
            <el-input
              v-model="speechData.coreGoal"
              placeholder="请输入核心目标"
            ></el-input>
          </el-form-item>
          <el-form-item label="会议类型">
            <el-input
              v-model="speechData.meetingType"
              placeholder="请输入会议类型"
            ></el-input>
          </el-form-item>
          <el-form-item label="重点内容">
            <el-input
              v-model="speechData.keyContent"
              placeholder="请输入重点内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="字数限制">
            <el-input
              v-model="speechData.wordsNum"
              placeholder="请输入字数"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="getSpeech">生成发言稿</el-button>
        <div v-if="aiSummary" class="loadding">
          <img
            style="width: 80px; height: 80px"
            src="../../assets/img/ai.gif"
            alt=""
          />
        </div>
        <div
          v-else
          style="font-size: 16px"
          class="summary"
          v-html="md.render(speech)"
        ></div>
      </el-tab-pane>
      <el-tab-pane label="主持人"></el-tab-pane>
      <el-tab-pane label="推荐会议"></el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { applyReactInVue } from "veaury";
import myReactComponent from "./jisit.tsx"; // 注意组件命名规范
import { ref, onMounted, onUnmounted } from "vue";
import {
  dayjs,
  ElMessage,
  type UploadFile,
  type UploadProps,
  type UploadRawFile,
  type UploadUserFile,
} from "element-plus";
import { agentExecuteAPI, fileDownloadAPI } from "@/apis/ai/ai.ts";
import type {
  AgentMessageList,
  GenerateSpeech,
  MessageList,
  User,
} from "@/types/home";
import { SSEService } from "@/utils/sse";
import { v4 as uuidv4 } from "uuid";
import { API_ENDPOINTS } from "@/apis/ai/aiSse";
import {
  agentId,
  getHeaders,
  speechAgentId,
  summaryAgentId,
} from "@/apis/ai/base";
import { copyText } from "vue3-clipboard";

import MarkdownIt from "markdown-it";
import { useRoute, useRouter } from "vue-router";
import { getMeetingResourceAPI, getSignDetailsAPI } from "@/apis/meeting.ts";
import { useMeetingStore } from "@/stores/meetingStore.ts";
import { Refresh } from "@element-plus/icons-vue";
import { baseUrl, ragUploadUrl } from "@/utils/baseUrl.ts";
import {
  generateSpeechAPI,
  getConclusionAPI,
  getMeetingInConclusionAPI,
} from "@/apis/aiMeeting";
import { uploadFileAPI } from "@/apis/rag.ts";
import { DOCUMENT_ENDPOINTS } from "@/apis/ai/pluginsSse";

let md: MarkdownIt = new MarkdownIt();
import * as xlsx from "xlsx";

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

// 文档创作
const startCreation = async () => {
  isLoading.value = true;

  messageList.value.push({
    role: "user",
    content: sendText.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

  const sse = new SSEService();

  sse.connect(
    DOCUMENT_ENDPOINTS.DOCUMENT_CREATION,
    "POST",
    {
      sid: uuidv4(),
      prompt:
        "你是文档专家，可以根据对应要求整理成一个规范，包含标题、段落、总结的文档",
      stream: true,
      chunks: [sendText.value],
    },
    (event) => {
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

// 文档翻译
const startTrans = async () => {
  isLoading.value = true;

  messageList.value.push({
    role: "user",
    content: sendText.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

  const sse = new SSEService();

  sse.connect(
    DOCUMENT_ENDPOINTS.DOCUMENT_TRANSLATE,
    "POST",
    {
      sid: uuidv4(),
      content: sendText.value,
      translate: "en",
      stream: true,
    },
    (event) => {
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      console.log(data);

      messageList.value[messageList.value.length - 1].content =
        data.data.transContent || "";
    },
    header.value
  );
};

onMounted(async () => {
  header.value = await getHeaders();
});

//处理音频流转文字数据

const audioText = ref("");

import { computed, Ref } from "vue";
import { useDownloadStore } from "@/stores/downlowdStore.ts";
import { useUserStore } from "@/stores/userStore.ts";
import {
  addToDoAPI,
  getMessageInfoAPI,
  getToDosByYearMonthAPI,
} from "@/apis/message.ts";

interface BaiduSpeechConfig {
  appid: string | number;
  appkey: string;
}

interface BaiduSpeechResult {
  status: Ref<string>;
  result: Ref<string>;
  error: Ref<string | null>;
  isRecording: Ref<boolean>;
  isConnecting: Ref<boolean>;
  statusDisplay: Ref<string>;
  startRecognition: () => Promise<void>;
  stopRecognition: () => void;
}

const useBaiduSpeechRecognition = (
  config: BaiduSpeechConfig
): BaiduSpeechResult => {
  const status = ref<"CLOSED" | "CONNECTING" | "OPEN" | "CLOSING">("CLOSED");
  const result = ref<string>("");
  const error = ref<string | null>(null);
  const ws = ref<WebSocket | null>(null);
  const mediaStream = ref<MediaStream | null>(null);
  const audioContext = ref<AudioContext | null>(null);
  const workletNode = ref<AudioWorkletNode | null>(null);
  const retryCount = ref<number>(0);
  const MAX_RETRIES = 3;

  // 生成随机ID
  const generateId = (): string => Math.random().toString(36).substr(2, 8);

  // 注册AudioWorklet
  const registerAudioWorklet = async (): Promise<void> => {
    try {
      // 关键路径配置：使用绝对路径确保生产环境能加载
      const workletUrl = new URL("../test/audio-processor.js", import.meta.url)
        .href;
      await audioContext.value!.audioWorklet.addModule(workletUrl);
    } catch (err) {
      console.error("加载AudioWorklet失败:", err);
      throw new Error("音频处理初始化失败");
    }
  };

  // 初始化录音
  const initRecorder = async (): Promise<void> => {
    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      audioContext.value = new AudioContext({ sampleRate: 16000 });
      await registerAudioWorklet();

      const source = audioContext.value.createMediaStreamSource(
        mediaStream.value
      );
      workletNode.value = new AudioWorkletNode(
        audioContext.value,
        "audio-processor"
      );

      source.connect(workletNode.value);
      workletNode.value.port.onmessage = (event: MessageEvent) => {
        if (
          status.value === "OPEN" &&
          ws.value?.readyState === WebSocket.OPEN
        ) {
          ws.value.send(event.data.data);
        }
      };
    } catch (err) {
      throw new Error(`录音初始化失败: ${(err as Error).message}`);
    }
  };

  // 处理WebSocket消息
  const handleMessage = (event: MessageEvent): void => {
    console.log("处理消息中");
    try {
      const data = JSON.parse(event.data);
      console.log(data);
      switch (data.type) {
        case "MID_TEXT":
          //result.value = data.result || "";
          captions.value = data.result || "";
          audioText.value += data.result || "";
          break;
        case "HEARTBEAT":
          break;
        case "ERROR":
          error.value = `识别错误: ${data.message}`;
          stopRecognition();
          break;
      }
    } catch (err) {
      console.error("消息解析错误:", err);
    }
  };

  // 清理资源
  const cleanUp = (): void => {
    if (
      ws.value &&
      ![WebSocket.CLOSED, WebSocket.CLOSING].includes(ws.value.readyState)
    ) {
      ws.value.close();
    }

    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => track.stop());
    }

    if (audioContext.value && audioContext.value.state !== "closed") {
      audioContext.value.close();
    }

    workletNode.value = null;
    status.value = "CLOSED";
  };

  // 开始识别
  const startRecognition = async (): Promise<void> => {
    if (status.value !== "CLOSED" && retryCount.value >= MAX_RETRIES) return;

    try {
      status.value = "CONNECTING";
      error.value = null;

      ws.value = new WebSocket(
        `wss://vop.baidu.com/realtime_asr?sn=${generateId()}`
      );

      ws.value.onopen = async () => {
        try {
          await initRecorder();
          ws.value!.send(
            JSON.stringify({
              type: "START",
              data: {
                appid: config.appid,
                appkey: config.appkey,
                dev_pid: 15372,
                cuid: generateId(),
                format: "pcm",
                sample: 16000,
              },
            })
          );
          status.value = "OPEN";
          retryCount.value = 0;
          console.log("WebSocket connected");
        } catch (err) {
          error.value = (err as Error).message;
          ws.value!.close();
        }
      };

      ws.value.onmessage = handleMessage;
      ws.value.onerror = () => {
        error.value = "连接错误，正在重试...";
        cleanUp();
        retry();
      };
      ws.value.onclose = () => cleanUp();
    } catch (err) {
      error.value = (err as Error).message;
      retry();
    }
  };

  // 重试逻辑
  const retry = (): void => {
    if (retryCount.value < MAX_RETRIES) {
      retryCount.value++;
      setTimeout(startRecognition, 1000 * retryCount.value);
    } else {
      error.value = "超过最大重试次数";
      cleanUp();
    }
  };

  // 停止识别
  const stopRecognition = (): void => {
    if (status.value === "OPEN") {
      status.value = "CLOSING";
      try {
        if (ws.value?.readyState === WebSocket.OPEN) {
          ws.value.send(JSON.stringify({ type: "END" }));
        }
      } finally {
        cleanUp();
      }
    }
  };

  // 计算属性
  const isRecording = computed<boolean>(() => status.value === "OPEN");
  const isConnecting = computed<boolean>(() => status.value === "CONNECTING");
  const statusDisplay = computed<string>(() => {
    switch (status.value) {
      case "CONNECTING":
        return "连接中...";
      case "OPEN":
        return "录音中";
      case "CLOSING":
        return "正在停止";
      default:
        return "准备就绪";
    }
  });

  return {
    status,
    result,
    error,
    isRecording,
    isConnecting,
    statusDisplay,
    startRecognition,
    stopRecognition,
  };
};

// 百度语音配置
const config: BaiduSpeechConfig = {
  appid: 118270267, // 替换为你的百度应用ID
  appkey: "BGXhWKtfsQhycN8SwNw35lhO", // 替换为你的百度应用Key
};

const {
  status,
  result,
  error,
  isRecording,
  isConnecting,
  statusDisplay,
  startRecognition,
  stopRecognition,
} = useBaiduSpeechRecognition(config);

const toggleRecognition = (): void => {
  isRecording.value ? stopRecognition() : startRecognition();
};

onMounted(() => {
  //startRecognition();
});

onUnmounted(() => {
  stopRecognition();
});

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

// 查看签到模块

const noSignTableData = ref<User[]>([]);
const signTableData = ref<User[]>([]);

const getSign = async () => {
  const res = await getSignDetailsAPI(meetingStore.meetingSettings!.id!);

  if (res.data.code === 200) {
    noSignTableData.value = res.data.data.books;
    signTableData.value = res.data.data.signs;
  } else {
    ElMessage.error("获取出错");
  }
};
const exportTableRef = ref(null);
const toExcel = () => {
  // 导出成excel
  const tableDom = exportTableRef.value?.$el;
  if (!tableDom) {
    return;
  }

  const wb = xlsx.utils.table_to_book(tableDom);
  xlsx.writeFile(wb, "签到情况.xlsx");
};

const summary = ref("");
const aiSummary = ref(false);

// 会议总结模块
const getMeetingSummary = async () => {
  aiSummary.value = true;

  //const res = await getMeetingInConclusionAPI(audioText.value);
  const res = await getMeetingInConclusionAPI(
    "公司召开第一次总经理办公会议，研究讨论公司经济合同管理、资金管理办法、机关20xx年3-5月份岗位工资发放等事宜。张XX总经理主持，公司领导，总经办、党群办及相关处室负责人参加。现将会议决定事项纪要如下：　一、关于公司经济合同管理办会议讨论了总经办提交的公司经济合同管理办法，认为实施船舶修理、物料配件和办公用品采购对外经济合同管理，有利于加强和规范企业管理。会议原则通过。会议要求，总经办根据会议决定进一步修改完善，发文执行。二、关于职工因私借款规定会议认为，职工因私借款是传统计划经济产物，不能作为文件规定。但是，从关心员工考虑，在职工遇到突到性困难时，公司可以酌情借10000元内的应急款。计财处要制定内部操作程序，严格把关。人力资源处配合。借款者本人要作出还款计划。三、关于公司资金管理办法会议认为计财处提交的公司资金管理办法有利于加强公司资金管理，提高资金使用效率，保障安全生产需要。会议原则通过，计财处修改完善后发文执行四、关于职工工资由银行代发事宜会议听取了计财处提交的关于职工岗位工资和船员伙食费由银行代发的汇报，会议认为银行代发工资是社会发展的必然趋势，既方便船舶和船员领取，又有利于规避存放大额现金的风险。但需要2个月左右的宣传过度期，让职工充分了解接受。会议要求计财处认真做好实施前的准备工作，人力资源处配合，计划下半年实施。五、关于公司机关11月份效益工资发放问题会议听取了人力资源处关于公司机关11月份岗位工资发放标准的建议。会议决定机关员工3-5月份岗位工资发放，对已经下文明确的干部执行新的岗位工资标准，没有下文明确的干部暂维持不变。待三个月考核明确岗位后，一律按新岗位标准发放。会议最后强调，公司机关要加强与运行船舶的沟通，建立公司领导每周上岗接船制度，完善机关管理员工随船工作制度，增强工作的针对性和有效性"
  );

  if (res.status === 200) {
    summary.value = res.data.data;
  } else {
    ElMessage.error("会议总结获取出错");
  }

  aiSummary.value = false;
};

const downStore = useDownloadStore();
const router = useRouter();
const toView = () => {
  downStore.setContent(summary.value);
  window.open("/view");
};

// 代办事项处理

const todoList = ref<MessageList>([]);
const userStore = useUserStore();

const isAdd = ref(false);
const addTodoData = ref({
  userId: userStore.user.id,
  messageId: null,
  createTime: dayjs().format("YYYY/MM/DD hh:mm:ss"),
  content: "",
  title: "",
});

const addTodo = async () => {
  const res = await addToDoAPI(
    addTodoData.value.userId,
    null,
    dayjs().format("YYYY/MM/DD hh:mm:ss"),
    addTodoData.value.title,
    addTodoData.value.content
  );

  if (res.data.code === 200) {
    ElMessage.success("添加成功");
    isAdd.value = false;
  } else {
    ElMessage.error(res.data.message);
  }
};

const isShow = ref(true);
const currentDay = ref("");
const viewCurrentList = ref<MessageList>([]);

const getTodos = async () => {
  const res = await getToDosByYearMonthAPI(
    userStore.user.id,
    new Date().getFullYear(),
    new Date().getMonth() + 1
  );

  if (res.data.code === 200) {
    todoList.value = res.data.data.messageToDoList;
    isShow.value = false;
    setTimeout(() => {
      isShow.value = true;
    }, 500);
  } else {
    ElMessage.error(res.data.msg);
  }
};

const toDoNumber = (day: string) => {
  return todoList.value.filter(
    (item) =>
      dayjs(item.createTime).format("YYYY-MM-DD") === day && item.status === "0"
  ).length;
};

const isHave = (day: string) => {
  return todoList.value.filter(
    (item) => dayjs(item.createTime).format("YYYY-MM-DD") === day
  );
};

const finish = async (id: number) => {
  const res = await getMessageInfoAPI(id);

  if (res.data.code === 200) {
    ElMessage.success("完成代办事项");

    getTodos();
  } else ElMessage.error("失败");
};

const getCurrentToDo = () => {
  viewCurrentList.value = isHave(dayjs(currentDay.value).format("YYYY-MM-DD"));
};

onMounted(() => {
  getTodos();
});

// 生成发言稿

const speech = ref("");
const speechData = ref<GenerateSpeech>({
  coreGoal: "",
  meetingType: "",
  keyContent: "",
  wordsNum: "",
});

const getSpeech = async () => {
  aiSummary.value = true;

  const res = await generateSpeechAPI(speechData.value);

  if (res.data.status === 200) {
    speech.value = res.data.data;
  } else {
    ElMessage.error("生成发言稿出错了");
  }

  aiSummary.value = false;
};
</script>

<style lang="scss" scoped>
.bigBox {
  height: 100vh;
  width: 100vw;
  position: relative;

  .summary {
    font-size: 16px !important;
  }

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
  min-height: 580px;
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
