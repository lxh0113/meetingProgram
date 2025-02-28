<template>
  <div class="searchItemBox" @click="toInternet">
    <div class="title">{{ prop.item.title }}</div>
    <div class="link">{{ prop.item.link }}</div>
    <div class="content">{{ prop.item.snippet }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { SearchItem } from "@/types/home";

const prop = withDefaults(
  defineProps<{
    item: SearchItem;
  }>(),
  {}
);

const toInternet = () => {
  window.open(prop.item.link);
};
</script>

<style lang="scss" scoped>
.searchItemBox {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  cursor: pointer;
  border-bottom: 1px solid $primary-border-color;
  padding-bottom: 20px;

  .title {
    color: $primary-color;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content {
    color: black;
    margin-top: 10px;
    text-indent: 2em;
  }
}
</style>
