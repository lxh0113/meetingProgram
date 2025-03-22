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
        <button @click="startAgent">提问</button>
      </div>
    </div>
    <div class="right">
      <div class="contentBox"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { agentExecuteAPI, getAiBaseURL } from "@/apis/ai/ai";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { onMounted, ref } from "vue";
import {
  appKey,
  getSign,
  agentId,
  getHeaders,
} from "../../apis/ai/base";
import { v4 as uuidv4 } from "uuid";
import type { AgentMessageList } from "@/types/home";

import MarkdownIt from "markdown-it";
import { SSEService } from "@/utils/sse";
import { API_ENDPOINTS } from "@/apis/ai/aiSse";
let md: MarkdownIt = new MarkdownIt();

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

const input = ref("请问如何学习");
const isLoading = ref(false);

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

let header={}

const startAgent = async () => {
  //设置isloading

  isLoading.value = true;

  let str = input.value;

  messageList.value.push({
    role: "user",
    content: input.value,
  });
  messageList.value.push({
    role: "assistant",
    content: "",
  });

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
      console.log(event.data);
      console.log(JSON.parse(event.data))
    },
    header
  );

  // input.value = "";

  // const res = await agentExecuteAPI(str);

  // isLoading.value = false;

  // console.log(
  //   res.data.data.session.messages[res.data.data.session.messages.length - 1]
  //     .content
  // );

  // let decodeContent = decodeUnicode(
  //   res.data.data.session.messages[res.data.data.session.messages.length - 1]
  //     .content
  // );
  // // messageList.value[messageList.value.length-1].content+=res.data.data.session.messages[res.data.data.session.messages.length-1].content
  // handleRender(decodeContent);
};

onMounted(async() => {
  header=await getHeaders()
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
        // flex: 1;
        background: rgba(255, 255, 255, 1);
        // border: 1px solid $primary-border-color;
        background-color: $primary-message-background-color;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 20px 20px 20px 0px;
        //   border:1px solid $primary-border-color;
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
      margin-left: 70px;
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
    width: 520px;
    margin-right: 20px;

    .contentBox {
      height: 100%;
      background: rgba(255, 255, 255, 1);
      box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
        rgba(17, 17, 26, 0.05) 0px 8px 32px;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 20px;
    }
  }
}
</style>
