<template>
  <div class="recommendForumsBox">
    <div class="top">
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
      <ForumCard v-for="(item,index) in postList" :data="item" @change-like="changeLike(index)" @change-star="changeStar(index)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HomeFilled, Plus, Refresh } from "@element-plus/icons-vue";
import ForumCard from "./components/forumCard.vue";
import { onMounted, ref } from "vue";
import { getPostsAPI } from "@/apis/forum";
import { ElMessage } from "element-plus";
import type { Post } from "@/types/home";

const postList = ref<Array<Post>>([]);

const getForum = async () => {
  const res = await getPostsAPI();

  if (res.data.code === 200) {
    postList.value = res.data.data;
  } else {
    ElMessage.error("获取出错");
  }
};

const changeLike=(index:number)=>{
  postList.value[index].likes++
}

const changeStar=(index:number)=>{
  postList.value[index].favorites++
}

onMounted(() => {
  getForum();
});
</script>

<style lang="scss" scoped>
.recommendForumsBox {
  box-sizing: border-box;
  padding: 20px;

  > .bottom {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 360px));
    gap: 20px;
  }
}
</style>
