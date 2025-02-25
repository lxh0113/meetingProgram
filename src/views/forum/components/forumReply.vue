<template>
  <div class="myCardBox">
    <div class="title">回复给: {{ props.data.parentUsername }}</div>
    <el-text line-clamp="6" style="text-align: left" v-html="props.data.comment">
    </el-text>
    <div class="bottom">
      <div>
        <span class="details" v-bind:class="{ active: isData.isViews }">
          <span class="iconfont icon-eye"></span>
          <span>{{ props.data.views }}</span>
        </span>
        <span
          class="details"
          @click="like"
          v-bind:class="{ active: isData.isLike }"
        >
          <span class="iconfont icon-like"></span>
          <span>{{ data.likes }}</span>
        </span>
        <span
          class="details"
          @click="star"
          v-bind:class="{ active: isData.isStar }"
        >
          <span class="iconfont icon-star"></span>
          <span>{{ data.stars }}</span>
        </span>
        <span class="details" @click="$emit('reply')">
          <span class="iconfont icon-edit"></span>
          <span>回帖</span>
        </span>
      </div>
      <span class="details">
        <span class="iconfont icon-time" style="color: #a6a6a6"></span>
        <span style="color: #a6a6a6">{{ props.data.time }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { favoriteCommentAPI, likeCommentAPI } from "@/apis/forum";
import { useUserStore } from "@/stores/userStore";
import type { ReplyPost } from "@/types/home";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";

const emit = defineEmits(["reply"]);

const props = withDefaults(
  defineProps<{
    data: ReplyPost;
    postId: number;
    actionData: {
      commentId: number;
      isLike: number;
      isFavorite: number;
    };
  }>(),
  {}
);

const isData = ref({
  isViews: 1,
  isLike: props.actionData?.isLike || 0,
  isStar: props.actionData?.isFavorite || 0,
});

const userStore = useUserStore();

const data = ref({
  likes: props.data.likes,
  stars: props.data.favorites,
});

watch(props, (old, newValue) => {
  console.log();
  data.value = {
    likes: newValue.data.likes,
    stars: newValue.data.favorites,
  };
  isData.value = {
    isViews: 1,
    isLike: newValue.actionData.isLike,
    isStar: newValue.actionData.isFavorite,
  };
});

const like = async () => {
  const res = await likeCommentAPI(
    props.postId,
    props.data.commentId,
    userStore.user!.id
  );

  if (res.data.code === 200) {
    ElMessage.success(res.data.message);

    if (isData.value.isLike === 0) {
      isData.value.isLike = 1;
      data.value.likes++;
    } else {
      isData.value.isLike = 0;
      data.value.likes--;
    }
  } else ElMessage.error(res.data.message);
};

const star = async () => {
  const res = await favoriteCommentAPI(
    props.postId,
    props.data.commentId,
    userStore.user!.id
  );

  if (res.data.code === 200) {
    if (isData.value.isStar === 0) {
      data.value.stars++;
      isData.value.isStar = 1;
    } else {
      data.value.stars--;
      isData.value.isStar = 0;
    }
    ElMessage.success(res.data.message);
  } else {
    ElMessage.error(res.data.message);
  }
};
</script>

<style lang="scss" scoped>
.myCardBox {
  // display: flex;
  // flex-direction: column;
  width: 100%;
  // height: 180px;
  padding: 20px;
  border: 1px solid $primary-border-color;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;

  transition: all 0.4s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .title {
    color: $primary-gray-text-color;
    line-height: 40px;
    font-size: 18px;
    font-weight: bold;
    font-style: italic;
  }

  .bottom {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    div {
      display: flex;
    }
  }

  .active {
    color: $primary-color;
  }

  .details {
    margin-right: 15px;
    font-size: 14px;
    height: 15px;
    display: flex;
    align-items: center;

    span:nth-child(1) {
      // color: $primary-color;
      margin-right: 5px;
    }

    span:nth-child(2) {
      font-size: 14px !important;
    }
  }
}
</style>
