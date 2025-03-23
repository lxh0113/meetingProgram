<template>
  <div class="myMenu">
    <div class="logoBox">
      <img
        @click="$router.push('/home')"
        src="../../assets/img/智慧通logo.png"
        alt=""
      />
    </div>
    <el-menu
      style="
        width: 240px;
        background-color: #f9fbfc;
        border-right: 0;
        box-sizing: border-box;
      "
      default-active="home"
      class="el-menu-vertical-demo"
      router
    >
      <el-menu-item
        v-for="(item, index) in props.nav"
        :index="item.path"
      >
        <span
          style="margin-left: 20px; margin-right: 10px"
          :class="'iconfont icon-' + item.icon"
        ></span>
        <span>{{ item.text }}</span>
      </el-menu-item>
    </el-menu>
  </div>
  <!-- <div class="zhanwei"></div> -->
</template>

<script lang="ts" setup>
import type { NavList } from "@/types/home";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
  defineProps<{
    nav: NavList;
  }>(),
  {}
);

const route = useRoute();

const getDefaultIndex = (path: string) => {
  let current = route.path.slice(1);
  // console.log(current.slice(1));

  let paths = path.split("/");

  if (paths[0] === current) return true;

  return false;
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.myMenu {
  box-sizing: border-box;
  background-color: #f9fbfc;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e1f2;
  position: fixed;
  // width: 240px;
  min-height: 100vh;

  .el-menu-item {
    color: $primary-gray-text-color;
  }

  .active {
    border: 0;
    background-color: $primary-background-color;
    color: $primary-color;
    border-radius: 5px;
    font-weight: bold;
  }

  //设置当前被选中的一级菜单
  .el-menu-item.is-active {
    border: 0;
    background-color: $primary-background-color;
    color: $primary-color;
    border-radius: 5px;
    font-weight: bold;
  }

  .logoBox {
    width: 240px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    // border-bottom: 1px solid $primary-border-color;

    img {
      width: 100%;
      height: fit-content;
    }
  }
}

.zhanwei {
  width: 240px;
  height: 100%;
}
</style>
