<template>
  <div class="headerBox">
    <div class="welcomeText">
      <h3>Hey,{{ userStore.user?.username }}</h3>
      <h6>欢迎回来，很高兴再次见到你</h6>
    </div>
    <div class="searchContent">
      <form class="form">
        <button>
          <svg
            width="17"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby="search"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              stroke-width="1.333"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
        <input
          class="input"
          placeholder="请键入你的关键字"
          required
          type="text"
          v-model="searchText"
        />
        <button class="reset" type="reset">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </form>
    </div>
    <div class="informationContent">
      <el-dropdown>
        <span style="display: flex; align-items: center; outline: none">
          <el-avatar :src="userStore.user?.avatar">user</el-avatar>
          <el-icon size="20" style="color: #79869f; margin-left: 15px"
            ><ArrowDown
          /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>消息中心</el-dropdown-item>
            <el-dropdown-item @click="$router.push('/login')"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon size="20" style="color: #79869f; margin-left: 20px"
        ><ChatDotRound
      /></el-icon>
      <el-icon size="20" style="color: #79869f; margin-left: 20px"
        ><Setting
      /></el-icon>
    </div>
  </div>
  <div class="zhanwei"></div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ArrowDown, Search } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/userStore";

const searchText = ref("");

const userStore = useUserStore();
</script>

<style lang="scss" scoped>
.headerBox {
  width: 100%;
  height: 100px;
  border-bottom: 1px solid $primary-border-color;
  border-left: 1px solid $primary-border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  background-color: white;
  box-sizing: border-box;

  .welcomeText {
    margin-left: 60px;

    h3 {
      color: $primary-color;
      font-size: 20px;
    }

    h6 {
      font-weight: 300;
      color: $primary-gray-text-color;
      margin-top: 10px;
    }
  }

  .searchContent {
    border-radius: 50px;
    // margin-right: 60px;

    .form button {
      border: none;
      background: none;
      color: #8b8ba7;
    }
    /* styling of whole input container */
    .form {
      --timing: 0.3s;
      --width-of-input: 200px;
      --height-of-input: 40px;
      --border-height: 2px;
      --input-bg: #fff;
      --border-color: #3578f6;
      --border-radius: 30px;
      --after-border-radius: 1px;
      position: relative;
      width: 300px;
      height: 40px;
      display: flex;
      align-items: center;
      padding-inline: 0.8em;
      border-radius: var(--border-radius);
      transition: border-radius 0.5s ease;
      background: var(--input-bg, #fff);
      border: 1px solid #8b8ba7;
    }
    /* styling of Input */
    .input {
      font-size: 0.9rem;
      background-color: transparent;
      width: 100%;
      height: 100%;
      padding-inline: 0.5em;
      padding-block: 0.7em;

      border: none;
    }
    /* styling of animated border */
    .form:before {
      content: "";
      position: absolute;
      background: var(--border-color);
      transform: scaleX(0);
      transform-origin: center;
      width: 100%;
      height: var(--border-height);
      left: 0;
      bottom: 0;
      border-radius: 1px;
      transition: transform var(--timing) ease;
    }
    /* Hover on Input */
    .form:focus-within {
      border-radius: var(--after-border-radius);
    }

    input:focus {
      outline: none;
    }
    /* here is code of animated border */
    .form:focus-within:before {
      transform: scale(1);
    }
    /* styling of close button */
    /* == you can click the close button to remove text == */
    .reset {
      border: none;
      background: none;
      opacity: 0;
      visibility: hidden;
    }
    /* close button shown when typing */
    input:not(:placeholder-shown) ~ .reset {
      opacity: 1;
      visibility: visible;
    }
    /* sizing svg icons */
    .form svg {
      width: 17px;
      margin-top: 3px;
    }
  }

  .informationContent {
    width: 400px;
    margin-right: 40px;
    display: flex;
    align-items: center;
    // background-color: red;
  }
}

.zhanwei {
  height: 100px;
  width: calc(100vw - 300px);
}
</style>
