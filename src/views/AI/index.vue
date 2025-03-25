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
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
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
            <div
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
            </div>
          </div>
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
        <button @click="chooseAsk">{{ buttonText[choose] }}</button>
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
                  action="/open/api/v2/document/upload"
                  :limit="10"
                  :headers="header"
                  :data="{
                    sourceId: userStore.user.id,
                    fileId: uuidv4(),
                  }"
                >
                  <el-button type="primary">上传文件</el-button>
                  <el-button type="success" @click.stop="searchFile"
                    >查询以往上传文件</el-button
                  >
                  <template #tip>
                    <div class="el-upload__tip">
                      ⽀持doc、docx、pdf、json、txt、xls、xlsx、ppt、pptx格式⽂件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="问答形式">
                <el-select v-model="choose" style="width: 200px" placeholder="">
                  <el-option label="提问" value="ask" />
                  <el-option label="检索原文" value="search" />
                  <el-option label="检索问答" value="chat" />
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
let md: MarkdownIt = new MarkdownIt();

const resumeList = ref<string[]>([]);

const userStore = useUserStore();
const choose = ref<string>("ask");
const buttonText = ref<Record<string, string>>({
  ask: "提问",
  search: "检索全文",
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
    content: "你好我是你的ai小助手",
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

  isLoading.value = false;

  // const res = await agentResumeAPI(uuidv4(), input.value);

  // if (res.data.code === 0) {
  //   console.log(res.data.data)
  //   // resumeList.value=res.data.
  // } else {
  //   ElMessage.error(res.data.msg);
  // }

  input.value = "";
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
};

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
      console.log(data);

      messageList.value[messageList.value.length - 1].content +=
        data.data.content || "";
    },
    header
  );
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
