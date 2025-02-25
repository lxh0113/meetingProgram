<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="240px"><Nav :nav="nav"></Nav></el-aside>
      <div class="right">
        <Header></Header>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { getNavList } from "@/utils/nav";
import Header from "../components/header.vue";
import Nav from "../components/nav.vue";

const nav = getNavList(2);
</script>

<style lang="scss" scoped>
:root {
  --el-header-padding: 0;
}
.homeBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  :deep(.el-header) {
    padding: 0px !important;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      flex: 1;
      margin-top: 100px;
      background-color: red;
    }
  }
}
</style>
