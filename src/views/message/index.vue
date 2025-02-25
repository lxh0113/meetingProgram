<template>
  <div class="messageBox">
    <div class="left">
      <span class="title"> 消息列表 </span>
      <div class="message" v-for="item in messageList">
        <div class="avatar">
          <el-avatar :size="50">{{ item.title }}</el-avatar>
        </div>
        <div class="content">
          <div class="messageTitle">{{ item.title }}</div>
          <el-text line-clamp="1">
            {{ item.content }}
          </el-text>
        </div>
        <div class="operation">
          <div class="time">{{ item.createTime }}</div>
          <div>
            <el-button
              v-if="item.status === '0'"
              @click="prepare(1, item.id)"
              text="plain"
              type="primary"
              >加入代办事项</el-button
            >
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: center">
        <el-pagination
          :page-size="5"
          :total="pageData.totalMessages"
          background
          layout="prev, pager, next"
        />
      </div>
    </div>
    <div class="right">
      <div class="title">
        <span class="title">代办事项</span>
        <el-button
          @click="toViewPrepare"
          style="margin-left: 20px"
          text="plain"
          type="success"
          >查看当天代办事项</el-button
        >
      </div>

      <div class="calendar">
        <el-calendar v-model="currentDay">
          <template #date-cell="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split("-").slice(1).join("-") }}
              {{ data.isSelected ? "✔️" : "" }}
            </p>
            <p style="margin-top: 20px; color: red" v-if="toDoNumber(data.day)">
              {{ toDoNumber(data.day) }}条代办
            </p>
            <!-- <p v-for="item in isHave(data.day)">{{ item.title }}</p> -->
          </template>
        </el-calendar>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    title="当天代办"
    draggable="true"
    width="500"
  >
    <el-timeline size="large" style="max-width: 600px">
      <el-timeline-item
        center
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
            @click="prepare(2, activity.id)"
            type="primary"
            >完成</el-button
          >
        </div>
      </el-timeline-item>

      <el-empty v-if="viewCurrentList.length === 0" description="无数据" />
    </el-timeline>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="remindVisible" title="注意" draggable="true" width="500">
    <span v-if="choose === 2">您确定要完成当前代办事项吗？</span>

    <el-form v-else :model="toDoData" label-width="70px" label-position="right">
      <el-form-item label="标题">
        <el-input v-model="toDoData.title" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="toDoData.content" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="toDoData.createTime"
          type="datetime"
          format="YYYY/MM/DD HH:mm:ss"
          placeholder=""
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="remindVisible = false">取消</el-button>
        <el-button type="primary" @click="toEnsure"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  addToDoAPI,
  getAllMessageListAPI,
  getMessageToDoInfoAPI,
} from "@/apis/message";
import { useUserStore } from "@/stores/userStore";
import type { MessageList } from "@/types/home";
import { dayjs, ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
const dialogVisible = ref(false);
const remindVisible = ref(false);
const choose = ref(1);
const messageList = ref<MessageList>([]);
const currentDay = ref("");

const todoList = ref<MessageList>([]);
const viewCurrentList = ref<MessageList>([]);
const toDoData = ref({
  createTime: "",
  title: "",
  content: "",
});

const pageData = ref({
  totalMessages: 1,
  totalPages: 1,
});

let currentId: number = 1;

const prepare = (value: number, id: number) => {
  choose.value = value;

  remindVisible.value = true;
  currentId = id;
};

const joinWork = async () => {
  const res = await addToDoAPI(
    userStore.user!.id,
    currentId,
    dayjs(toDoData.value.createTime).format("YYYY-MM-DD hh:mm:ss"),
    toDoData.value.title,
    toDoData.value.content
  );
  if (res.data.code === 200) {
    ElMessage.success("加入代办事件成功");
    getMessage();
  } else ElMessage.error(res.data.message);
};

const ensureWorked = async () => {
  const res = await getMessageToDoInfoAPI(currentId);

  if (res.data.code === 200) {
    ElMessage.success("完成代办事项");
    // 重新获取并且排列
    getMessage();
  } else ElMessage.error("失败");
};

const toEnsure = () => {
  if (choose.value === 1) {
    joinWork();
  } else {
    ensureWorked();
  }

  remindVisible.value = false;
};

const getMessage = async () => {
  const res = await getAllMessageListAPI(userStore.user!.id);

  if (res.data.code === 200) {
    messageList.value = res.data.data.messagelist;
    pageData.value = {
      totalMessages: res.data.data.totalMessages,
      totalPages: res.data.data.totalPages,
    };

    todoList.value = res.data.data.messageToDoList;
  } else ElMessage.error("获取失败");
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

const toViewPrepare = () => {
  console.log(currentDay.value);
  viewCurrentList.value = isHave(dayjs(currentDay.value).format("YYYY-MM-DD"));

  dialogVisible.value = true;
};

onMounted(() => {
  getMessage();
});
</script>

<style lang="scss" scoped>
.messageBox {
  padding: 20px;
  box-sizing: border-box;
  display: flex;

  .is-selected {
    color: #1989fa;
  }

  .card {
    padding: 20px;
    display: flex;

    h4 {
      color: $primary-color;
    }
  }

  .title {
    color: $primary-color;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
  }

  > .left {
    min-width: 500px;
    display: flex;
    flex-direction: column;
    margin-right: 40px;

    .message {
      display: flex;
      align-items: center;
      height: 80px;
      border-bottom: 1px solid $primary-border-color;
      cursor: pointer;

      .avatar {
        width: 80px;
        display: flex;
        justify-content: center;
      }

      .content {
        flex: 1;

        .messageTitle {
          font-size: 18px;
          margin-bottom: 5px;
        }
      }

      .operation {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .time {
          color: $primary-gray-text-color;
          font-size: 14px;
          margin-right: 15px;
        }
      }
    }
  }

  > .right {
    flex: 1;
    max-width: 800px;
    display: flex;
    flex-direction: column;
  }
}
</style>
