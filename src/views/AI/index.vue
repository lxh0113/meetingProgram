<template>
  <div class="zhitongBox">
    <div class="left">
      <el-scrollbar
        style="box-sizing: border-box; padding-right: 30px"
        max-height="600px"
      >
        <div
          v-for="(item, index) in messageList"
          :class="item.role === 'assistant' ? 'aiMessage' : 'myMessage'"
        >
          <img
            v-if="item.role === 'assistant'"
            style="width: 50px; height: 50px; margin-right: 20px"
            src="../../assets/img/logo.png"
            alt=""
          />
          <!-- <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          > -->
          <div
            v-if="isLoading && index === messageList.length - 1"
            class="message"
          >
            <img
              style="
                padding: 0 10px;
                width: 20px;
                height: 20px;
                transform: scale(3) translateY(2px);
              "
              src="../../assets/loading.gif"
              alt=""
            />
          </div>
          <div v-else class="message" v-html="md.render(item.content)"></div>
          <!-- <div
              v-if="item.role === 'assistant' && resumeList.length"
              class="resume"
            >
              <p v-for="i in resumeList" @click="toAsk(i)">
                <img
                  style="width: 30px; height: 30px"
                  src="../../assets/img/ai.gif"
                  alt=""
                />{{ i }}
              </p>
            </div> -->
          <!-- </div> -->
        </div>
      </el-scrollbar>
      <div class="inputBox">
        <input
          class="input"
          name="text"
          type="text"
          v-model="input"
          placeholder="请输入你的问题..."
        />
        <button v-if="choose != 'audio'" @click="chooseAsk">
          {{ buttonText[choose] }}
        </button>
        <button v-else @click="startRecording">{{ audioButton }}</button>
        <el-popover placement="top" :width="500" trigger="click">
          <template #reference>
            <button>更多操作</button>
          </template>
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="文章上传">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="ragUploadUrl"
                  :limit="10"
                  :data="{
                    meeting_id: null,
                  }"
                  name="files"
                >
                  <el-button type="primary">上传文件</el-button>
                  <!-- <el-button type="success" @click.stop="searchFile"
                    >查询以往上传文件</el-button
                  > -->
                  <template #tip>
                    <div class="el-upload__tip">
                      ⽀持doc、docx、pdf、txt格式⽂件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="问答形式">
                <el-select v-model="choose" style="width: 200px" placeholder="">
                  <el-option label="提问" value="ask" />
                  <el-option label="检索问答" value="rag" />
                  <el-option label="语音交互" value="audio" />
                  <!-- <el-option label="检索原文" value="search" />
                  <el-option label="检索问答" value="chat" /> -->
                  <el-option label="文档创作" value="creation" />
                  <el-option label="文档翻译" value="trans" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-popover>
      </div>
    </div>
    <div v-if="rightShow" class="right">
      <div class="contentBox">
        <el-table :data="fileTableData" style="width: 100%" height="500">
          <el-table-column prop="filename" label="文件名称" />
          <el-table-column prop="updateTs" label="上传时间" />
          <el-table-column label="文件大小">
            <template #default="scope">
              {{ formatFileSize(scope.row.fileSize) }}
            </template>
          </el-table-column>
          <el-table-column label="下载">
            <template #default="scope">
              <el-button
                type="primary"
                plain
                text
                @click="downloadFile(scope.row.fileId)"
                >下载</el-button
              >
              <el-button
                type="danger"
                plain
                text
                @click="deleteFile(scope.row.fileId)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <audio ref="audioRef" hidden :src="audioSrc" controls></audio>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { agentId, getHeaders } from "../../apis/ai/base";
import { v4 as uuidv4 } from "uuid";
import type { AgentMessageList } from "@/types/home";
import {
  ElMessage,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
} from "element-plus";

import MarkdownIt from "markdown-it";
import { SSEService } from "@/utils/sse";
import { API_ENDPOINTS } from "@/apis/ai/aiSse";
import { DOCUMENT_ENDPOINTS } from "@/apis/ai/pluginsSse";
import {
  documentDeleteAPI,
  documentInternalDownloadAPI,
  documentMetadataPageQueryAPI,
  documentSearchAPI,
} from "@/apis/ai/plugins";
import { useUserStore } from "@/stores/userStore";
import { isHealthAPI, queryDocAPI } from "@/apis/rag";
import { ragUploadUrl } from "@/utils/baseUrl";

let md: MarkdownIt = new MarkdownIt();

const resumeList = ref<string[]>([]);

const userStore = useUserStore();
const choose = ref<string>("ask");
const buttonText = ref<Record<string, string>>({
  ask: "提问",
  rag: "检索问答",
  search: "检索全文",
  audio: "语音交互",
  chat: "检索问答",
  creation: "文档创作",
  trans: "文档翻译",
});
const form = ref({});

const upload = ref<UploadInstance>();

const messageList = ref<AgentMessageList>([
  {
    role: "user",
    content: "你好",
  },
  {
    role: "assistant",
    content: "你好，我是智会精灵",
  },
]);

const rightShow = ref(false);

const input = ref("请问如何学习");
const isLoading = ref(false);

let header = {};

// 根据情况问答
const chooseAsk = async () => {
  preStart();

  switch (choose.value) {
    case "ask":
      startAgent();
      break;
    case "rag":
      startRag();
      break;
    case "audio":
      break;
    case "search":
      startSearch();
      break;
    case "chat":
      startChat();
      break;
    case "creation":
      startCreation();
      break;
    case "trans":
      startTrans();
      break;
  }

  // const res = await agentResumeAPI(uuidv4(), input.value);

  // if (res.data.code === 0) {
  //   console.log(res.data.data)
  //   // resumeList.value=res.data.
  // } else {
  //   ElMessage.error(res.data.msg);
  // }
};

const preStart = () => {
  if (input.value.trim() === "") {
    ElMessage.error("您并未写入任何内容");
    return;
  }

  isLoading.value = true;

  messageList.value.push({
    role: "user",
    content: input.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

  console.log(isLoading.value);
};

// 处理渲染逻辑
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

// 普通问答
const startAgent = async () => {
  const sse = new SSEService();

  sse.connect(
    API_ENDPOINTS.EXECUTE,
    "POST",
    {
      sid: uuidv4(),
      id: agentId,
      input: input.value,
      stream: true,
    },
    (event) => {
      // input.value = "";
      // console.log(event)
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      // console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header
  );
};

const isHealth = async () => {
  const res = await isHealthAPI();

  if (res.data.status === "healthy") {
    return true;
  } else {
    ElMessage.error("服务器繁忙，请稍后重试");
    choose.value = "ask";

    return false;
  }
};

const startRag = async () => {
  // const flag = await isHealth();

  // if (!flag) return;

  // 开始检索问答

  // isLoading.value = true;

  const res = await queryDocAPI(input.value, null);
  console.log(res);
  if (res.status === 200) {
    isLoading.value = false;
    console.log(res);

    handleRender(res.data.answer);
  } else {
    ElMessage.error("服务器繁忙，请稍后重试");
    choose.value = "ask";
  }
};

// 检索全文
const startSearch = async () => {
  const res = await documentSearchAPI(input.value);

  if (res.data.code === 0) {
    console.log(res.data.data);
  }
};

// 检索问答
const startChat = async () => {
  const sse = new SSEService();

  sse.connect(
    DOCUMENT_ENDPOINTS.DOCUMENT_CHAT,
    "POST",
    {
      query: input.value,
      stream: true,
      owner: "admin",
      labels: [],
      permissions: ["111"],
    },
    (event) => {
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header
  );
};

// 文档创作
const startCreation = async () => {
  const sse = new SSEService();

  sse.connect(
    DOCUMENT_ENDPOINTS.DOCUMENT_CREATION,
    "POST",
    {
      sid: uuidv4(),
      prompt:
        "你是文档专家，可以根据对应要求整理成一个规范，包含标题、段落、总结的文档",
      stream: true,
      chunks: [input.value],
    },
    (event) => {
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header
  );
};

// 文档翻译
const startTrans = async () => {
  const sse = new SSEService();

  sse.connect(
    DOCUMENT_ENDPOINTS.DOCUMENT_TRANSLATE,
    "POST",
    {
      sid: uuidv4(),
      content: input.value,
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
    header
  );
};

const filePageData = ref({
  current: 1,
  size: 10,
});

const fileTableData = ref([]);

const searchFile = async () => {
  rightShow.value = true;

  const res = await documentMetadataPageQueryAPI(
    filePageData.value.current,
    filePageData.value.size
  );

  if (res.data.code === 0) {
    console.log(res.data.data);
    fileTableData.value = res.data.data.data;
  } else {
    ElMessage.error(res.data.msg);
  }
};

const formatFileSize = (bytes: any) => {
  if (typeof bytes !== "number") bytes = Number(bytes);
  if (isNaN(bytes)) return "-";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${
    units[unitIndex]
  }`;
};

const downloadFile = async (id: string) => {
  const res = await documentInternalDownloadAPI(id);

  if (res.data.code === 0) {
    console.log(res.data.data);
  } else {
    ElMessage.error(res.data.msg);
  }
};

const deleteFile = async (id: string) => {
  const res = await documentDeleteAPI(userStore.user.id + "", id);

  if (res.data.code === 0) {
    ElMessage.success("删除成功");
    searchFile();
  } else {
    ElMessage.error(res.data.msg);
  }
};

const toAsk = (str: string) => {
  input.value = str;

  chooseAsk();
};

onMounted(async () => {
  header = await getHeaders();
});

// 语音交互回答

import { XfVoiceDictation } from "@muguilin/xf-voice-dictation";

let times: any = null;
const audioButton = ref<string>("点我开始");

// 实例化迅飞语音听写（流式版）WebAPI

const xfVoice = new XfVoiceDictation({
  APPID: "f17e53d0",
  APISecret: "MmNkMjBkZDFiY2RjMGU5ZjdkYTVjMDBh",
  APIKey: "f90a475bbf4eac0d8eb57524cbed229e",
  url: "wss://iat-api.xfyun.cn/v2/iat",

  // 监听录音状态变化回调
  onWillStatusChange: function (oldStatus, newStatus) {
    // 可以在这里进行页面中一些交互逻辑处理：如：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
    console.log("识别状态：", oldStatus, newStatus);

    if (newStatus === "init") {
      // 初始化
      audioButton.value = "开始识别";
    } else if (newStatus === "ing") {
      // 进行中
      audioButton.value = "正在监听中";
    } else if (newStatus === "end") {
      // 已结束
      audioButton.value = "提问中";
      audioChat();
    }
  },

  // 监听识别结果的变化回调
  onTextChange: function (text: string) {
    // 可以在这里进行页面中一些交互逻辑处理：如将文本显示在页面中
    console.log("识别内容：", text);

    input.value = text;

    // 如果3秒钟内没有说话，就自动关闭（60s后也会自动关闭）
    if (text) {
      clearTimeout(times);
      times = setTimeout(() => xfVoice.stop(), 3000);
    }
  },

  // 监听识别错误回调
  onError: function (error: any) {
    console.log("错误信息：", error);
  },
});

// 调用开始语音识别！
const startRecording = () => {
  xfVoice.start();
};

import Recorder from "js-audio-recorder";

onMounted(() => {
  // handleStart()
});

// 语音合成模块
import axios from "axios";
import qs from "qs";
import type { S } from "mockjs";
// import { HZRecorder } from "./utils/recorder";

// 提示
const openMsg = (message, type) => {
  ElMessage({
    message,
    type,
  });
};

// 1.获取AccessToken
// client_id是你创建的应用的API Key，client_secret是你创建应用的Secret Key
const client_id = ref("oQEDes0o2TsfOR8N5XCkrtXi");
const client_secret = ref("VYLYGTe9K7F062cOBXvAVRLO9ZCFYHIJ");

const handleGetAccessToken = async () => {
  try {
    const option = {
      grant_type: "client_credentials",
      client_id: client_id.value,
      client_secret: client_secret.value,
    };
    const res = await axios.post("/oauth/2.0/token", qs.stringify(option));
    if (res.status !== 200) {
      return openMsg(res.statusText, "warning");
    }
    // openMsg("获取token成功", "success");
    localStorage.setItem("access_token", res.data.access_token);
    client_id.value = "oQEDes0o2TsfOR8N5XCkrtXi";
    client_secret.value = "VYLYGTe9K7F062cOBXvAVRLO9ZCFYHIJ";
  } catch (error) {
    console.log(error);
  }
};

// 2.语音合成接口调用
// per配音角色
const per = ref("111");
let audioSrc = ref("");
let audioRef = ref(null);

const handleTextToAudio = async (content: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return openMsg("请先获取token！", "warning");
  }
  textToAudio(token, content);
};
const textToAudio = async (token: any, content: string) => {
  const option = {
    tex: content,
    tok: token,
    cuid: `${Math.floor(Math.random() * 1000000)}`,
    ctp: "1",
    lan: "zh",
    per: per.value,
  };
  const res = await axios.post("/text2audio", qs.stringify(option), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    responseType: "blob",
  });
  if (res.status !== 200) {
    return openMsg(res.statusText, "warning");
  } else {
    audioSrc.value = URL.createObjectURL(res.data);

    let audio = new Audio(audioSrc.value);
    audio.play();

    audio.addEventListener("ended", () => {});
  }
};

onMounted(() => {
  handleGetAccessToken();
});

const audioChat = async () => {
  preStart();
  // 调用大模型文档

  const sse = new SSEService();

  sse.connect(
    API_ENDPOINTS.EXECUTE,
    "POST",
    {
      sid: uuidv4(),
      id: agentId,
      input: input.value,
      stream: true,
    },
    (event) => {
      // input.value = "";
      // console.log(event)
      isLoading.value = false;

      // console.log(event.data);
      let data = JSON.parse(event.data);
      // console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header,
    () => {
      let content = messageList.value[messageList.value.length - 1].content;
      console.log(content);
      handleTextToAudio(content);
    }
  );
};
</script>

<style lang="scss" scoped>
.zhitongBox {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  // background-color: red;
  min-height: calc(100vh - 200px);
  align-items: stretch;

  .left {
    flex: 1;
    margin-right: 20px;

    .aiMessage {
      display: flex;
      justify-content: left;
      margin-bottom: 20px;
      margin-right: 20px;

      .avatar {
        margin-right: 20px;
      }

      .message {
        background: rgba(255, 255, 255, 1);
        // border: 1px solid $primary-border-color;
        background-color: $primary-message-background-color;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 20px 20px 20px 0px;
        //   border:1px solid $primary-border-color;
      }

      .resume {
        box-sizing: border-box;
        margin-top: 5px;
        line-height: 30px;
        font-size: small;

        p {
          background-color: $primary-message-background-color;
          box-sizing: border-box;
          padding: 5px 10px;
          margin-top: 5px;
          border-radius: 10px 10px 10px 0;
          display: flex;
          align-items: center;

          img {
            margin-right: 10px;
          }
        }
      }
    }

    .myMessage {
      margin-bottom: 20px;
      margin-right: 20px;
      display: flex;
      justify-content: right;

      .message {
        background-color: $primary-color;
        box-sizing: border-box;
        padding: 20px;
        color: white;
        margin-left: 70px;
        border-radius: 20px 20px 0 20px;
      }
    }

    .inputBox {
      display: flex;
      margin-left: 30px;
      margin-right: 60px;

      button {
        width: 200px;
        font-size: 18px;
        border-radius: 30px;
        border: none;
        color: white;
        opacity: 1;
        margin-left: 20px;
        background: linear-gradient(
          142.41deg,
          rgba(74, 37, 225, 1) 0%,
          rgba(53, 120, 246, 1) 100%
        );
        box-shadow: 0px 21px 27px -10px rgba(96, 60, 255, 0.48);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .input {
        width: 100%;
        //   max-width: 220px;
        height: 30px;
        padding: 12px;
        border-radius: 20px;
        border: 1.5px solid lightgrey;
        outline: none;
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        box-shadow: 0px 0px 20px -18px;
      }

      .input:hover {
        border: 2px solid lightgrey;
        box-shadow: 0px 0px 20px -17px;
      }

      .input:active {
        transform: scale(0.95);
      }

      .input:focus {
        border: 2px solid grey;
      }
    }
  }

  .right {
    width: 540px;
    margin-right: 20px;

    .contentBox {
      height: 100%;
      background: rgba(255, 255, 255, 1);
      box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
        rgba(17, 17, 26, 0.05) 0px 8px 32px;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 20px;
      max-height: calc(100vh - 200px);
    }
  }
}
</style>
