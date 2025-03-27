<template>
  <div class="bigBox">
    <div class="button">
      <el-button
        type="primary"
        size="large"
        @click="() => exportWordDocx()"
        >word 下载</el-button
      >
      <el-button
        type="primary"
        size="large"
        @click="() => htmlToPDF('box', '错题报告')"
        >pdf 下载</el-button
      >
    </div>
    <div class="backBox">
      <div id="box">
        <h1>会议资料</h1>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { htmlToPDF } from "@/utils/html2pdf";
import { exportWordDocx } from "@/utils/exportWord";
</script>

<style lang="scss" scoped>
.bigBox {
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #e6e6e6;
  display: flex;
  flex-direction: column;
}

.button {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.backBox {
  width: 100%;
  flex: 1;
  // background: red;
  display: flex;
  justify-content: center;

  #box {
    // width: 70%;
    width: 1000px;
    margin-top: 20px;
    margin-bottom: 20px;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    // background: red;
    padding: 40px;
    box-sizing: border-box;

    h1 {
      color: $primary-color;
    }
  }
}
</style>
