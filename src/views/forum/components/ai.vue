<template>
  <div class="aiBox">
    <div class="top">
      <span class="title"> AI工具 </span>
      <el-popover placement="right" :width="900" trigger="click">
        <template #reference>
          <el-button type="primary">查看历史会话记录</el-button>
        </template>
        <el-table :data="tableData">
          <el-table-column width="300" prop="title" label="标题" />
          <el-table-column width="180" label="上次更新">
            <template #default="scope">
              <span>{{
                dayjs(scope.row.updated_at).format("YY-M-D h:m:s")
              }}</span>
            </template>
          </el-table-column>

          <el-table-column width="360" label="操作">
            <template #default="scope">
              <el-button type="primary" @click="getCurrentMessage(scope.row.id)"
                >继续上次操作</el-button
              >
              <el-button
                type="success"
                @click="saveConversationId(scope.row.id)"
                >更新标题</el-button
              >
              <el-button type="danger" @click="deleteConversation(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-popover>

      <el-switch
        v-model="isInternet"
        class="ml-2"
        style="--el-switch-on-color: #13ce66"
      />
      是否开启联网搜索
    </div>
    <div class="content" :ref="scrollRef">
      <div class="outerMessage" v-for="(item, index) in currentMessage">
        <span class="time">{{
          dayjs(item.created_at).format("YY-M-D h:m:s")
        }}</span>
        <div class="aiMessage" v-if="item.role === 'assistant'">
          <img class="avatar" src="../../../assets/img/logo.png" />
          <div
            v-if="isLoading && index === currentMessage.length - 1"
            class="message"
          >
            <img
              style="
                padding: 0 10px;
                width: 20px;
                height: 20px;
                transform: scale(3) translateY(2px);
              "
              src="../../../assets/loading.gif"
              alt=""
            />
          </div>
          <div v-else class="message" v-html="md.render(item.content)"></div>
        </div>
        <div v-else class="myMessage">
          <div class="message">{{ item.content }}</div>
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
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>

  <!-- <el-dialog
    draggable="true"
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :modal="false"
    :width="800"
    @open="handleOverlay"
    title="联网搜索"
  >
    <el-input
      v-model="searchText"
      placeholder="输入你需要联网搜索的内容"
      :suffix-icon="Search"
      @keyup.enter="searchFormInternet"
    ></el-input>

    <div
      v-if="searchData.length === 0"
      style="display: flex; justify-content: center"
    >
      <el-empty description="无数据" />
    </div>

    <div class="mySearachItems">
      <SearchItem v-for="item in searchData" :item="item" />
    </div>
  </el-dialog> -->

  <el-dialog
    v-model="updateTitleDialogVisible"
    title="更新会议标题"
    width="500"
  >
    <div style="margin-bottom: 10px">会议标题</div>
    <el-input v-model="title" placeholder="请输入会议标题"></el-input>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="updateTitleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateConversationTitle">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  createConversationAPI,
  deleteConversationByIdAPI,
  getAllConversationsAPI,
  getConversationByIdAPI,
  internetAPI,
  updateConversationTitleAPI,
} from "@/apis/forum/chat";
import type {
  AIMessageList,
  ConversationList,
  CurrentConversation,
  SearchItemList,
} from "@/types/home";
import { Search } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { nextTick, onMounted } from "vue";
import { ref, watch } from "vue";
import SearchItem from "@/components/SearchItem.vue";
import { getForumAIUrl } from "@/utils/baseUrl";
import { ElMessage } from "element-plus";
import MarkdownIt from "markdown-it";
import { SSEService } from "@/utils/sse";
import { useUserStore } from "@/stores/userStore";
let md: MarkdownIt = new MarkdownIt();

let scrollRef = ref();

const updateTitleDialogVisible = ref(false);
const title = ref("");
const sendText = ref("");
const dialogVisible = ref(false);
const isInternet = ref(false);

const userStore=useUserStore()
const searchText = ref("");

watch(isInternet, (oldValue, newValue) => {
  console.log(newValue);
  if (oldValue === true) {
    dialogVisible.value = true;
  } else dialogVisible.value = false;
});

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

const tableData = ref<ConversationList>([]);

const getConversations = async () => {
  const res = await getAllConversationsAPI(userStore.user.id+"");

  if (res.data.code === 200) {
    tableData.value = res.data.data;
  }
};

// 联网搜索

const searchData = ref<SearchItemList>([]);

const searchFormInternet = async () => {
  const res = await internetAPI(searchText.value);

  if (res.status === 200) {
    searchData.value = res.data.results;
  }
};

// 对话内容
const currentMessage = ref<AIMessageList>([]);

const getCurrentMessage = async (id: number) => {
  const res = await getConversationByIdAPI(id,userStore.user.id+"");

  console.log(res);
  if (res.data.code === 200) {
    currentMessage.value = res.data.data.messages;
    currentConversition.value = {
      id: res.data.data.id,
      title: res.data.data.title,
      search_enabled: res.data.data.search_enabled,
    };
  }
};

onMounted(() => {
  getConversations();
});

// sse 接受消息

// 解码包含Unicode转义序列的字符串
function decodeUnicode(str: string) {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, function (match) {
    return String.fromCharCode(parseInt(match.substr(2), 16));
  });
}

// 当前会话需要存储id
const currentConversition = ref<CurrentConversation>();

// 创建会话
const createConversation = async (title: string, isInternet: boolean) => {
  const res = await createConversationAPI(title,userStore.user.id+"");

  if (res.data.code === 201) {
    currentConversition.value = res.data.data;
  } else {
    ElMessage.error("连接服务器失败");
  }
};

const isLoading = ref(false);

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
      currentMessage.value[currentMessage.value.length - 1].content += chunk;
    });
    index += step; // 更新索引
  }, interval);
}

const sendMessage = async () => {
  // 如果有当前会话
  if (currentConversition.value?.id) {
  } else {
    // 如果无 创建
    await createConversation(sendText.value, isInternet.value);
  }

  currentMessage.value.push({
    id: currentConversition.value!.id,
    role: "user",
    content: sendText.value,
    created_at: new Date().toDateString(),
    metadata: {},
  });

  currentMessage.value.push({
    id: currentConversition.value!.id,
    role: "assistant",
    content: "",
    created_at: new Date().toDateString(),
    metadata: {},
  });

  isLoading.value = true;

  let sse = new SSEService();

  sse.connect(
    getForumAIUrl(currentConversition.value!.id) +
      `?user_id=${userStore.user.id}`,
    "POST",
    {
      query: sendText.value,
      stream: true,
      history: [],
    },
    (event: any) => {
      // 这里处理收到的消息
      let data = JSON.parse(event.data);
      console.log("收到SSE消息:", data);
      isLoading.value = false;
      if (data?.done) {
        return;
      }

      if (data?.content) {
        let decodeContent = decodeUnicode(data!.content);
        console.log(decodeContent);

        handleRender(decodeContent);
      } else {
        setTimeout(() => {
          isLoading.value = false;
        });
      }
    }
  );

  // await fetchEventSource(
  //   getForumAIUrl(currentConversition.value!.id) +
  //     `?search_enabled=${isInternet.value}`,
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json;charset=utf-8",
  //     },
  //     body: JSON.stringify({
  //       query: sendText.value,
  //       stream: true,
  //       history: [],
  //     }),
  //     openWhenHidden: true,
  //     async onopen() {},
  //     onmessage(event) {
  //       isLoading.value = false;

  //       let data = JSON.parse(event.data);
  //       if (data?.done) {
  //         return;
  //       }

  //       if (data?.content) {
  //         let decodeContent = decodeUnicode(data!.content);
  //         console.log(decodeContent);

  //         handleRender(decodeContent);
  //       } else {
  //         setTimeout(() => {
  //           isLoading.value = false;
  //         });
  //       }
  //     },
  //     onerror(error) {
  //       console.error("SSE 连接出错：", error);
  //     },
  //   }
  // );

  sendText.value = "";
};

const currentConversationId = ref<number>(1);

const saveConversationId = (id: number) => {
  currentConversationId.value = id;
  updateTitleDialogVisible.value = true;
};

const updateConversationTitle = async () => {
  const res = await updateConversationTitleAPI(
    currentConversationId.value,
    title.value,
    userStore.user.id+""
  );

  if (res.data.code === 200) {
    getConversations();
    ElMessage.success("更新成功");
  } else {
    ElMessage.error("更新失败");
  }

  updateTitleDialogVisible.value = false;
};

const deleteConversation = async (id: number) => {
  const res = await deleteConversationByIdAPI(id,userStore.user.id+"");

  if (res.data.code === 200) {
    tableData.value = tableData.value.filter((item) => {
      return item.id !== id;
    });
    ElMessage.success("删除成功");
  } else {
    ElMessage.error("删除失败");
  }
};
</script>

<style lang="scss" scoped>
li {
  margin-left: 20px !important;
}
.aiBox {
  width: 100%;
  // height: 100%;
  border: 1px solid $primary-border-color;
  border-radius: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
  box-sizing: border-box;
  // padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  height: calc(100vh - 140px);

  .top {
    background-color: $primary-color;
    margin-bottom: 20px;
    padding: 20px;
    color: white;

    .title {
      color: white;
      font-weight: bold;
      font-size: 18px;
    }

    /* From Uiverse.io by Wendell47 */
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 15px 30px;
      border: 0;
      position: relative;
      overflow: hidden;
      border-radius: 10rem;
      transition: all 0.02s;
      font-weight: bold;
      cursor: pointer;
      color: rgb(37, 37, 37);
      z-index: 0;
      box-shadow: 0 0px 7px -5px rgba(0, 0, 0, 0.5);
    }

    .button:hover {
      background: rgb(193, 228, 248);
      color: rgb(33, 0, 85);
    }

    .button:active {
      transform: scale(0.97);
    }

    .hoverEffect {
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .hoverEffect div {
      background: rgb(222, 0, 75);
      background: linear-gradient(
        90deg,
        rgba(222, 0, 75, 1) 0%,
        rgba(191, 70, 255, 1) 49%,
        rgba(0, 212, 255, 1) 100%
      );
      border-radius: 40rem;
      width: 10rem;
      height: 10rem;
      transition: 0.4s;
      filter: blur(20px);
      animation: effect infinite 3s linear;
      opacity: 0.5;
    }

    .button:hover .hoverEffect div {
      width: 8rem;
      height: 8rem;
    }

    @keyframes effect {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }

  .content {
    flex: 1;
    margin: 0px 20px;
    overflow-y: scroll;
    padding-right: 20px;

    .outerMessage {
      display: flex;
      flex-direction: column;

      .time {
        display: flex;
        justify-content: center;
        color: $primary-gray-text-color;
        font-size: 12px;
        margin-bottom: 5px;
      }
    }

    .aiMessage {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;

      .avatar {
        height: 50px;
        width: 50px;
        border-radius: 50%;
      }

      .message {
        background-color: $primary-message-background-color;
        border-radius: 0px 10px 10px 10px;
        padding: 10px;
        margin-left: 20px;
        // padding-left: 20px;
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
.mySearachItems {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}
</style>
