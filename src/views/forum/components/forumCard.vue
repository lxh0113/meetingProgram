<template>
  <div class="myCardBox" @click="toForum">
    <span class="title" v-html="props.data.label"></span>
    <el-text
      class="content"
      line-clamp="5"
      style="width: 100%; height: 180px"
      v-html="props.data.content"
    >
    </el-text>
    <div class="bottom">
      <span class="details">
        <span class="iconfont icon-eye"></span>
        <span>{{ props.data.views }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-like"></span>
        <span @click="like">{{ props.data.likes }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-star"></span>
        <span @click="star">{{ props.data.favorites }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { favoritePostAPI } from "@/apis/forum";
import { useUserStore } from "@/stores/userStore";
import type { Post } from "@/types/home";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const props = withDefaults(
  defineProps<{
    data: Post;
  }>(),
  {}
);

const toForum = () => {
  router.push("/forum/" + props.data.id);
};

const userStore = useUserStore();
const emit = defineEmits(["changeLike", "changeStar"]);

const like = async () => {
  const res = await favoritePostAPI(props.data.id, userStore.user!.id);

  if (res.data.code === 200) {
    emit("changeLike");
  } else ElMessage.error(res.data.message);
};

const star = async () => {
  const res = await favoritePostAPI(props.data.id, userStore.user!.id);

  if (res.data.code === 200) {
    emit("changeStar");
  } else ElMessage.error(res.data.message);
};
</script>

<style lang="scss" scoped>

.myCardBox {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 240px;
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
    color: $primary-color;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 6px;
  }

  .content {
    // display: flex;
    text-indent: 2rem;
    text-align: left;
  }

  .bottom {
    margin-top: 5px;
    display: flex;
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
