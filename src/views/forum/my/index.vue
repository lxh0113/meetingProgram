<template>
  <div class="myForumBox">
    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="我的帖子" name="first">
        <div class="forums">
          <MyForumItem v-for="item in myPostData" :data="item" />
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center">
          <el-empty v-if="myPostData.length === 0" description="无数据" />
          <el-pagination
            v-else
            layout="prev, pager, next"
            :page-size="myPostPageData.pageSize"
            :total="myPostPageData.totalPosts"
            :current-page="myPostPageData.currentPage"
            @current-change="getMyPost"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的点赞" name="second">
        <div class="forums">
          <ForumCard v-for="item in myLikePostData" :data="item" />
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center">
          <el-empty v-if="myLikePostData.length === 0" description="无数据" />
          <el-pagination
            v-else
            layout="prev, pager, next"
            :page-size="myLikePostPageData.pageSize"
            :current-page="myLikePostPageData.currentPage"
            :total="myLikePostPageData.totalPosts"
            @current-change="getMyLike"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的收藏" name="third">
        <div class="forums">
          <ForumCard v-for="item in myStarPostData" :data="item" />
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center">
          <el-empty v-if="myStarPostData.length === 0" description="无数据" />
          <el-pagination
            v-else
            layout="prev, pager, next"
            :page-size="myStarPostPageData.pageSize"
            :total="myStarPostPageData.totalPosts"
            :current-page="myStarPostPageData.currentPage"
            @current-change="getMyStar"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的关注" name="fourth">
        <div class="forums">
          <ForumCard v-for="item in myStarPostData" :data="item" />
        </div>
        <div style="margin-top: 20px; display: flex; justify-content: center">
          <el-empty v-if="myStarPostData.length === 0" description="无数据" />
          <el-pagination
            v-else
            layout="prev, pager, next"
            :page-size="myStarPostPageData.pageSize"
            :total="myStarPostPageData.totalPosts"
            @current-change="getMyStar"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage, type TabsPaneContext } from "element-plus";
import ForumCard from "../components/forumCard.vue";
import MyForumItem from "./components/myForumItem.vue";
import {
  getFavorateAPI,
  getLikeAPI,
  getPostAPI,
  getUserFollowAPI,
} from "@/apis/users";
import { useUserStore } from "@/stores/userStore";
import type { Post } from "@/types/home";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  console.log(activeName.value)

  if (activeName.value === "first") {
    getMyPost();
  } else if (activeName.value === "second") {
    getMyLike();
  } else if (activeName.value === "third") {
    getMyStar();
  } else {
    getMyFollow();
  }
};

const userStore = useUserStore();
const myPostData = ref<Array<Post>>([]);
const myPostPageData = ref({
  totalPosts: 1,
  pageSize: 5,
  currentPage: 1,
});
const myLikePostData = ref<Array<Post>>([]);
const myLikePostPageData = ref({
  totalPosts: 1,
  pageSize: 5,
  currentPage: 1,
});
const myStarPostData = ref<Array<Post>>([]);
const myStarPostPageData = ref({
  totalPosts: 1,
  pageSize: 5,
  currentPage: 1,
});
const myFollowPostData = ref<Array<Post>>([]);
const myFollowPostPageData = ref({
  totalPosts: 1,
  pageSize: 5,
  currentPage: 1,
});

const getMyPost = async () => {
  const res = await getPostAPI(
    userStore.user!.id,
    myPostPageData.value.currentPage
  );

  if (res.data.code === 200) {
    myPostData.value = res.data.data.posts;
  } else ElMessage.error("获取出错");
};

const getMyLike = async () => {
  const res = await getLikeAPI(
    userStore.user!.id,
    myLikePostPageData.value.currentPage
  );

  if (res.data.code === 200) {
    myLikePostData.value = res.data.data.posts;
    myLikePostPageData.value.totalPosts = res.data.data.totalPosts;
  } else ElMessage.error("获取出错");
};

const getMyStar = async () => {
  const res = await getFavorateAPI(
    userStore.user!.id,
    myStarPostPageData.value.currentPage
  );

  if (res.data.code === 200) {
    myStarPostData.value = res.data.data.posts;
    myStarPostPageData.value = res.data.data.totalPosts;
  } else ElMessage.error("获取出错");
};

const getMyFollow = async () => {
  const res = await getUserFollowAPI(
    userStore.user!.id,
    myFollowPostPageData.value.currentPage
  );

  if (res.data.code === 200) {
    myFollowPostData.value = res.data.data.posts;
    myFollowPostPageData.value.totalPosts = res.data.data.totalPages;
  } else {
    ElMessage.error(res.data.message);
  }
};

onMounted(() => {
  getMyPost();
});
</script>

<style lang="scss" scoped>
.myForumBox {
  box-sizing: border-box;
  padding: 20px;

  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  .forums {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 360px));
    gap: 20px;
    margin-top: 10px;
  }
}
</style>
