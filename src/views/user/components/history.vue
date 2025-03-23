<template>
  <div class="bigBox">
    <video
      :src="url"
      crossorigin="anonymous"
      style="width: 100%; height: 90%"
      controls
    ></video>
    <div class="right">
      <span class="title">
        <img src="../../../assets/img/logo.png" alt="" />智通精灵
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute();

let url = ref<string>("");

onMounted(() => {
  url.value = decodeURIComponent(route.params.url as string);
});
</script>

<style lang="scss" scoped>
.bigBox {
  max-width: 100vw;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .right {
    min-width: 500px;
    // border: 1px solid $primary-border-color;
    // border-radius: 10px;
    // box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    margin-left: 20px;

    > .title {
      color: $primary-color;
      font-weight: bold;
      font-size: large;
      display: flex;
      align-items: center;

      img{
        width: 50px;
        height: 50px;
        
      }
    }
  }
}
</style>
