<template>
  <div class="myCardBox">
    <span class="title">{{ props.post.label }}</span>
    <el-text line-clamp="2" style="height: 50px">
      {{ props.post.content }}
    </el-text>
    <div class="bottom">
      <span class="details">
        <span class="iconfont icon-eye"></span>
        <span>{{ props.post.views }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-like"></span>
        <span>{{ props.post.likes }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-star"></span>
        <span>{{ props.post.favorites }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Post } from "@/types/home";

const props = withDefaults(
  defineProps<{
    post: Post;
  }>(),
  {}
);
</script>

<style lang="scss" scoped>
.myCardBox {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 120px;
  padding: 10px;
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
