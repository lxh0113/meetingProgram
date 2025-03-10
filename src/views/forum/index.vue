<template>
  <div class="recommendForumsBox">
    <div class="top">
      <el-input
        v-model="searchText"
        placeholder="请输入你所需要查询的内容"
        :suffix-icon="Search"
        style="width: 300px; margin-right: 20px"
        @keyup.enter="searchForum"
      ></el-input>
      <el-button
        :icon="DataLine"
        type="danger"
        @click="$router.push('/forum/rank')"
        >排行榜</el-button
      >
      <el-button
        :icon="Plus"
        type="success"
        @click="$router.push('/forum/publish')"
        >发布新帖</el-button
      >
      <el-button :icon="Refresh" type="primary">换一换</el-button>
      <el-button
        type="primary"
        text="plain"
        :icon="HomeFilled"
        @click="$router.push('/forum/my')"
        >我的个人主页</el-button
      >
    </div>

    <div class="bottom">
      <ForumCard
        v-for="(item, index) in postList"
        :data="item"
        @change-like="changeLike(index)"
        @change-star="changeStar(index)"
      />
    </div>
    <div style="display: flex; justify-content: center; margin-top: 20px">
      <el-pagination
        v-if="postList.length"
        background
        layout="prev, pager, next"
        :total="pageData.total"
        :change="searchForum"
      />
      <el-empty v-else description="无数据" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DataLine, HomeFilled, Plus, Refresh, Search } from "@element-plus/icons-vue";
import ForumCard from "./components/forumCard.vue";
import { onMounted, ref } from "vue";
import { getPostsAPI, searchForumAPI } from "@/apis/forum";
import { ElMessage } from "element-plus";
import type { Post } from "@/types/home";

const postList = ref<Array<Post>>([]);

const getForum = async () => {
  if (searchText.value.trim() !== "") {
    searchForum();
    return;
  }

  const res = await getPostsAPI();

  if (res.data.code === 200) {
    postList.value = res.data.data;
  } else {
    ElMessage.error("获取出错");
  }
};

const changeLike = (index: number) => {
  postList.value[index].likes++;
};

const changeStar = (index: number) => {
  postList.value[index].favorites++;
};

// 搜索
const searchText = ref("");

const pageData = ref({
  currentPage: 1,
  total: 1,
  pageSize: 8,
});

const searchForum = async () => {
  if (searchText.value.trim() === "") {
    searchForum();
    return;
  }

  const res = await searchForumAPI(
    searchText.value,
    pageData.value.currentPage
  );

  if (res.data.code === 200) {
    postList.value = res.data.data.findPostVos;
    pageData.value.total = res.data.data.totalPages;

    // 高亮显示
    const presetRegex = new RegExp(
      `(<[^>]*>)|(${searchText.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );

    postList.value.forEach((item, index) => {
      item.content = item.content.replace(
        presetRegex,
        (match, tag, kw) =>
          tag || `<span style="font-weight:bold;color:red;">${kw}</span>`
      );
      item.label = item.label.replace(
        presetRegex,
        (match, tag, kw) => tag || `<span style="color:red;">${kw}</span>`
      );
    });
  }
};

onMounted(() => {
  getForum();
});
</script>

<style lang="scss" scoped>
.recommendForumsBox {
  box-sizing: border-box;
  padding: 20px;

  > .top {
    display: flex;
  }

  > .bottom {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 360px));
    gap: 20px;
  }
}
</style>
