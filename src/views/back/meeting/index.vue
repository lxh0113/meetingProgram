<template>
  <div class="meetingBox">
    <div class="top">
      <el-input
        v-model="searchText"
        placeholder="请输入你所需要查询的主题"
        style="width: 300px; margin-right: 20px"
      ></el-input>
      <el-select
        style="width: 120px; margin-right: 20px"
        v-model="status"
        placeholder=""
      >
        <el-option label="全部" :value="-1" />
        <el-option label="未开始" :value="0" />
        <el-option label="进行中" :value="1"></el-option>
        <el-option label="已结束" :value="2"></el-option>
      </el-select>
      <el-button type="primary" :icon="Search" @click="searchMeetings"
        >查询</el-button
      >
    </div>
    <div class="bottom">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="会议号" />
        <el-table-column prop="title" label="主题" />
        <el-table-column prop="creator" label="创建人" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.url">user</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="info">未开始</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success"
              >进行中</el-tag
            >
            <el-tag v-else type="danger">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="users" label="在线人数" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-empty v-if="tableData.length === 0" description="无数据" />
        <el-pagination
          v-else
          background
          :total="pageData.totalMeetings"
          :current-page="pageData.currentPage"
          :size="8"
          @current-change="getMeetings"
          layout="prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { adminFindMeetingsAPI, adminGetMeetingsAPI } from "@/apis/admin";
import type { MeetingList } from "@/types/home";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const searchText = ref("");
// 0 未开始 1 正在进行 2 已结束
const status = ref<number | null>(-1);

const tableData = ref<MeetingList>([]);
const pageData = ref({
  totalMeetings: 1,
  currentPage: 1,
});

const getMeetings = async () => {
  const res = await adminGetMeetingsAPI(pageData.value.currentPage);

  if (res.data.code === 200) {
    tableData.value = res.data.data.meetings;
    pageData.value.totalMeetings = res.data.data.totalMeetings;
  } else ElMessage.error(res.data.message);
};

const searchMeetings = async () => {
  const res = await adminFindMeetingsAPI(
    searchText.value,
    pageData.value.currentPage,
    status.value === -1 ? null : status.value
  );

  if (res.data.code === 200) {
    tableData.value = res.data.data.meetings;
    pageData.value.totalMeetings = res.data.data.totalMeetings;
  } else ElMessage.error(res.data.message);
};

onMounted(() => {
  getMeetings();
});
</script>

<style lang="scss" scoped>
.meetingBox {
  box-sizing: border-box;
  padding: 20px;

  .top {
    display: flex;
  }

  .bottom {
    margin-top: 20px;
  }
}
</style>
