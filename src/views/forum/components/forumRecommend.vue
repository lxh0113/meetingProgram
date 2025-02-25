<template>
  <div class="myCardBox">
    <span class="title">震惊</span>
    <el-text line-clamp="3" style="height: 70px">
      Self element set width 100px Self element set width 100px Self element set
      width 100px Self element set width 100px Self element set width 100px Self
      element set width 100px
    </el-text>
    <div class="bottom">
      <span class="details">
        <span class="iconfont icon-like"></span>
        <span>200</span>
      </span>
      <span class="details">
        <span class="iconfont icon-comments"></span>
        <span>200</span>
      </span>
      <span class="details">
        <span class="iconfont icon-share"></span>
        <span>200</span>
      </span>
      <span class="details">
        <span class="iconfont icon-time" style="color: #a6a6a6;"></span>
        <span style="color: #a6a6a6;">2025/1/1 12:00</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.myCardBox {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 140px;
  padding: 10px;
  border: 1px solid $primary-border-color;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;
//   margin-bottom: 20px;
  // box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;

  transition: all 0.4s;

  &:hover {
    transform: translateY(-4px);

    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  .title {
    //   color: $primary-color;
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
