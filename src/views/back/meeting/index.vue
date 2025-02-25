<template>
  <div class="meetingBox">
    <div class="top">
      <el-input
        v-model="searchText"
        placeholder="请输入你所需要查询的会议号"
        style="width: 300px; margin-right: 20px"
      ></el-input>
      <el-select
        style="width: 120px; margin-right: 20px"
        v-model="status"
        placeholder=""
      >
        <el-option label="在线" value="在线" />
        <el-option label="已结束" value="已结束"></el-option>
      </el-select>
      <el-button type="primary" :icon="Search">查询</el-button>
    </div>
    <div class="bottom">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="会议号" />
        <el-table-column prop="title" label="主题" />
        <el-table-column prop="creator" label="创建人" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar">user</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="peopleNumber" label="在线人数" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { ref } from "vue";

const searchText = ref("");
const status = ref("在线");

const tableData = ref([
  {
    id: 1,
    creator: "12",
    avatar: "",
    createTime: "2024/12/1 12:00:12",
    status: "进行中",
    peopleNumber: 12,
    title: "121212",
  },
]);
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
