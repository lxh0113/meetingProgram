<template>
  <div class="publishForumBox">
    <div class="left">
      <div class="top">
        <span class="title"> {{ postData?.label }} </span>
        <div class="details">
          <div class="time">
            <el-icon size="18"><Timer /></el-icon>
            <span>{{ postData?.createTime }}</span>
          </div>
          <div class="text">{{ postData?.views }}+人浏览了该帖</div>
        </div>
        <div class="content" v-html="postData?.content"></div>
        <div class="operation">
          <div class="view" v-bind:class="{ active: activeData.isView }">
            <span class="iconfont icon-eye"></span>
            <span>{{ postData?.views }}</span>
          </div>
          <div class="like" v-bind:class="{ active: activeData.isLike }">
            <span @click="like" class="iconfont icon-like"></span>
            <span>{{ postData?.likes }}</span>
          </div>
          <div class="star" v-bind:class="{ active: activeData.isStar }">
            <span @click="star" class="iconfont icon-star"></span>
            <span>{{ postData?.favorites }}</span>
          </div>
          <div class="button">
            <!-- <el-button type="primary" :icon="Plus">关注</el-button> -->
            <el-button text="primary" plain :icon="Edit" @click="reply"
              >回帖</el-button
            >
            <el-button
              :type="activeData.isAttention ? 'plain' : 'danger'"
              :icon="Plus"
              @click="toAttention"
              >{{ activeData.isAttention ? "取消关注" : "关注" }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="bottom">
        <span class="title"> {{ postData?.totalComments }}条相关回帖 </span>
        <div class="replyForum">
          <ForumReply
            :post-id="postData!.id"
            v-for="(item, index) in postData?.comments"
            :key="item.commentId"
            @reply="replyComment(item)"
            :action-data="actionData[index]"
            :data="item"
          />
          <div
            v-if="postData?.comments.length === 0"
            style="display: flex; justify-content: center"
          >
            <el-empty description="无数据" />
          </div>
          <el-pagination
            v-if="postData?.comments.length"
            style="display: flex; justify-content: center"
            background
            :current-page="postData?.currentPage"
            :page-size="postData?.pageSize"
            layout="prev, pager, next"
            :total="postData?.totalComments"
            @current-change="getPostDetails"
          />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="authorInfo">
        <el-avatar :size="60" :src="postData?.userInfoVo.avatar"
          >User</el-avatar
        >
        <div class="info">
          <span class="username"> {{ postData?.author }} </span>
          <span>{{ postData?.authorPostCount }}+ 帖子</span>
        </div>
        <el-button type="primary" :icon="Plus">关注</el-button>
      </div>
      <span class="more">更多相似论坛</span>
      <div class="recommend">
        <ForumRecommend v-for="item in 2" />
      </div>
    </div>
  </div>

  <el-drawer v-model="drawer" direction="rtl">
    <template #header>
      <h4>回帖给{{ currentName }}</h4>
    </template>
    <template #default>
      <myEditor is-reply="1" @getContent="publish" />
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { Edit, Plus } from "@element-plus/icons-vue";
import ForumRecommend from "./forumRecommend.vue";
import ForumReply from "./forumReply.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  attentionPostAPI,
  commentByCommentIdAPI,
  commentPostAPI,
  favoritePostAPI,
  getActionsAPI,
  getPostByIdAPI,
  likePostAPI,
} from "@/apis/forum";
import type { ReplyPost, ViewPost } from "@/types/home";
import { dayjs, ElMessage } from "element-plus";
import { useUserStore } from "@/stores/userStore";
import myEditor from "./myEditor.vue";

const route = useRoute();
const userStore = useUserStore();
const postData = ref<ViewPost>();

const activeData = ref({
  isView: 1,
  isLike: 0,
  isStar: 0,
  isAttention: 1,
});

const actionData = ref([
  {
    commentId: 1,
    isLike: 0,
    isFavorite: 0,
  },
]);

const getPostDetails = async (currentPage = 1) => {
  const res = await getPostByIdAPI(
    parseInt(route.params.id as string),
    currentPage
  );

  if (res.data.code === 200) {
    postData.value = res.data.data;
    activeData.value.isView = 1;
  } else ElMessage.error("获取出错");
};

const like = async () => {
  let id = parseInt(route.params.id as string);

  const res = await likePostAPI(id, userStore.user!.id);
  if (res.data.code === 200) {
    ElMessage.success(res.data.message);
    if (activeData.value.isLike === 0) {
      activeData.value.isLike = 1;
      postData.value!.likes++;
    } else {
      activeData.value.isLike = 0;
      postData.value!.likes--;
    }
  } else ElMessage.error(res.data.message);
};

const star = async () => {
  let id = parseInt(route.params.id as string);

  const res = await favoritePostAPI(id, userStore.user!.id);

  if (res.data.code === 200) {
    ElMessage.success(res.data.message);
    if (activeData.value.isStar === 0) {
      activeData.value.isStar = 1;
      postData.value!.favorites++;
    } else {
      activeData.value.isStar = 0;
      postData.value!.favorites--;
    }
  } else ElMessage.error(res.data.message);
};

// 回帖
const drawer = ref(false);
const currentName = ref("");
const parentCommentId = ref(0);

const reply = () => {
  // 回复 帖子
  currentName.value = postData.value!.userInfoVo.username;
  parentCommentId.value = 0;

  drawer.value = true;
};

const replyComment = (item: ReplyPost) => {
  // 回复子评论
  currentName.value = item.parentUsername;
  parentCommentId.value = item.commentId;
  drawer.value = true;
};

const publish = async (data: { title: string; content: string }) => {
  let flag = confirm("你确定要发布吗");

  if (!flag) return;

  if (parentCommentId.value === 0) {
    // 回复帖子
    const res = await commentPostAPI(postData.value!.id, {
      userId: userStore.user!.id,
      time: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      parentCommentId: parentCommentId.value,
      comment: data.content,
    });

    if (res.data.code === 200) {
      ElMessage.success(res.data.message);
    } else ElMessage.error(res.data.message);
  } else {
    const res = await commentByCommentIdAPI(
      postData.value!.id,
      parentCommentId.value,
      {
        userId: userStore.user!.id,
        time: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
        parentCommentId: parentCommentId.value,
        comment: data.content,
      }
    );

    if (res.data.code === 200) {
      ElMessage.success(res.data.message);
    } else ElMessage.error(res.data.message);
  }

  drawer.value = false;
};

const getAction = async () => {
  let id = parseInt(route.params.id as string);

  const res = await getActionsAPI(id, userStore.user!.id);

  if (res.data.code === 200) {
    activeData.value.isLike = res.data.data.userActionVo.isLike;
    activeData.value.isStar = res.data.data.userActionVo.isFavorite;
    activeData.value.isAttention = res.data.data.isAttention;
    actionData.value = res.data.data.commentsActionVoArray;
  } else ElMessage.error(res.data.message);
};

// 关注取消关注
const toAttention = async () => {
  const res = await attentionPostAPI(postData.value!.id, userStore.user!.id);

  if (res.data.code === 200) {
    if (activeData.value.isAttention === 0) {
      activeData.value.isAttention = 1;
    } else {
      activeData.value.isAttention = 0;
    }

    ElMessage.success(res.data.message);
  } else {
    ElMessage.error(res.data.message);
  }
};

onMounted(() => {
  getPostDetails();
  getAction();
});
</script>

<style lang="scss" scoped>
.publishForumBox {
  box-sizing: border-box;
  padding: 20px;
  display: flex;

  > .left {
    margin-right: 20px;
    flex: 1;

    > .top {
      margin-bottom: 20px;
      border: 1px solid $primary-border-color;
      box-sizing: border-box;
      padding: 20px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;

      .title {
        // color:$primary-color;
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 10px;
      }

      .active {
        color: $primary-color;
      }

      .details {
        display: flex;
        align-items: center;

        .time {
          color: $primary-gray-text-color;
          margin-right: 20px;
          line-height: 20px;
          display: flex;
          align-items: center;

          span {
            margin-left: 10px;
          }
        }

        .text {
          color: $primary-color;
        }
      }

      .content {
        text-indent: 2rem;
        margin-top: 20px;
      }

      .operation {
        display: flex;
        align-items: center;
        margin-top: 20px;

        div span:nth-child(1) {
          // color: $primary-color;
          // font-weight: bold;
        }

        div span:nth-child(2) {
          margin-left: 10px;
          margin-right: 20px;
        }
      }
    }

    > .bottom {
      > .title {
        display: block;
        font-weight: bold;
        font-size: 20px;
        color: $primary-color;
        margin-bottom: 20px;
      }

      .replyForum {
        display: grid;
        gap: 20px;
      }
    }
  }

  > .right {
    // margin-right: 20px;
    min-width: 400px;
    border: 1px solid $primary-border-color;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;

    .authorInfo {
      display: flex;

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20px;

        .username {
          color: $primary-color;
          font-weight: bold;
          font-size: 18px;
        }

        span:nth-child(2) {
          color: $primary-gray-text-color;
        }
      }
    }

    .more {
      color: $primary-gray-text-color;
      margin: 20px 0px;
      font-size: 14px;
    }

    .recommend {
      display: grid;
      gap: 20px;
    }
  }
}
</style>
