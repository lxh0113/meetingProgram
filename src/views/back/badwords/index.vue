<template>
  <div class="userBox">
    <div class="top">
      <el-tag
        type="primary"
        style="margin-right: 10px; margin-bottom: 10px"
        v-for="item in 299"
        >{{ Random.cname() }}</el-tag
      >
    </div>
    <div class="bottom">
      <el-input
        v-model="searchText"
        placeholder="请输入你所需要查询的违禁词"
        :prefix-icon="Search"
        style="width: 240px; margin-right: 20px"
      ></el-input>
      <el-button type="primary" :icon="Plus">添加</el-button>
      <el-button type="success" :icon="Edit">编辑</el-button>
      <el-button type="danger" :icon="Delete">删除符合条件的违禁词</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Edit, Plus, Search } from "@element-plus/icons-vue";
import { Random } from "mockjs";
import { onMounted, ref } from "vue";

const searchText = ref("");

const tableData = ref([
  {
    id: 1,
    text: "123",
  },
]);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.userBox {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;
    flex-wrap: wrap;
  }

  .bottom {
    margin-top: 40px;
    border-top: 1px solid $primary-border-color;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
