<template>
  <div class="bigBox">
    <MyReactComponent />
    <div class="affixed">
      <el-button
        circle
        @click="dialogVisible = true"
        style="width: 80px; height: 80px"
        plain=""
      >
        <img
          style="width: 70px; height: 70px"
          src="../../assets/img/logo.png"
          alt=""
        />
      </el-button>
    </div>
  </div>

  <el-dialog
    draggable="true"
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :modal="false"
    :width="800"
    style="min-height: 500px"
    @open="handleOverlay"
    title="智通精灵"
  >
    <el-tabs tab-position="left" style="height: 500px" class="demo-tabs">
      <el-tab-pane label="智通会话">
        <div class="message">
          <span class="date">2024/12/12 12:00</span>
          <div class="aiMessage">
            <img src="../../assets/img/logo.png" alt="">
            <span>123</span>
          </div>
        </div>
        <div class="message">
          <span class="date">2024/12/12 12:00</span>
          <div class="myMessage">
            <span>123</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资料下载">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
        >
          <el-button type="primary">点击上传</el-button>
          <el-button @click.stop="aiGenerate" text="plain" type="primary"
            >AI查询会议资源</el-button
          >
          <template #tip>
            <div class="el-upload__tip">可选择文件上传</div>
          </template>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="智能总结">
        <button type="button" class="button">
          <span class="fold"></span>

          <div class="points_wrapper">
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
            <i class="point"></i>
          </div>

          <span class="inner"
            ><svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
            >
              <polyline
                points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
              ></polyline></svg
            >AI 智能总结</span
          >
        </button>
      </el-tab-pane>

      <el-tab-pane label="代办事项">
       
      </el-tab-pane>

      <el-tab-pane label="会议设置">
        <el-form label-position="left">
          <el-form-item label="开启会议录制">
            <el-switch
              v-model="isRecord"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="实时字幕">
            <el-switch
              v-model="isRecord"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="智能区分发言人">
            <el-switch
              v-model="isRecord"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="分享会议">
            <el-button text="plain" type="primary">链接分享</el-button>
          </el-form-item>
          <el-form-item label="签到">
            <el-button type="primary" text="plain">查看已到</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="推荐会议">
        
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { applyReactInVue } from "veaury";
import myReactComponent from "./jisit.tsx"; // 注意组件命名规范
import { ref } from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";

const isRecord = ref(false);
const dialogVisible = ref(false);
// 穿透遮罩层
function handleOverlay() {
  //获取对话框Dom
  let overlay = <HTMLElement>document.querySelector(".is-draggable");
  // 设置pointerEvents='auto',使对话框可以正常操作
  overlay!.style.pointerEvents = "auto";
  //通过对话框Dom获取遮罩层Dom,修改其pointerEvents = 'none',使其他区域可正常操作
  //第一层遮罩层
  let overlayFa = <HTMLElement>overlay!.parentNode;
  overlayFa.style.pointerEvents = "none";
  //第二层遮罩层
  let overlayGfa = overlay!.parentNode!.parentNode;
  overlayGfa.style.pointerEvents = "none";
}

const fileList = ref<UploadUserFile[]>([
  {
    name: "food.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
  {
    name: "food2.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (file) => {
  console.log(file);
};

const aiGenerate = () => {};

const MyReactComponent = applyReactInVue(myReactComponent);
</script>

<style lang="scss" scoped>
.bigBox {
  height: 100vh;
  width: 100vw;
  position: relative;

  .affixed {
    position: absolute;

    right: 80px;
    bottom: 80px;
  }
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 20px;
  box-sizing: border-box;

  .date {
    color: $primary-gray-text-color;
    font-size: 14px;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
  }

  .aiMessage {
    display: flex;
    justify-content: left;

    img{
      width: 40px;
      height: 40px;
      margin-right: 20px;
    }

    span {
      background-color: $primary-color;
      color: white;
      margin-right: 60px;
      padding: 10px;
      border-radius: 10px 10px 10px 0px;
    }
  }

  .myMessage {
    display: flex;
    justify-content: right;

    span {
      background-color: $primary-message-background-color;
      margin-left: 60px;
      padding: 10px;
      border-radius: 10px 10px 0px 10px;
    }
  }
}

/* From Uiverse.io by ilkhoeri */
.button {
  --h-button: 48px;
  --w-button: 102px;
  --round: 0.75rem;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.25s ease;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
  border-radius: var(--round);
  border: none;
  outline: none;
  padding: 12px 18px;
}
.button::before,
.button::after {
  content: "";
  position: absolute;
  inset: var(--space);
  transition: all 0.5s ease-in-out;
  border-radius: calc(var(--round) - var(--space));
  z-index: 0;
}
.button::before {
  --space: 1px;
  background: linear-gradient(
    177.95deg,
    rgba(255, 255, 255, 0.19) 0%,
    rgba(255, 255, 255, 0) 100%
  );
}
.button::after {
  --space: 2px;
  background: radial-gradient(
      65.28% 65.28% at 50% 100%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    ),
    linear-gradient(0deg, #7a5af8, #7a5af8);
}
.button:active {
  transform: scale(0.95);
}

.fold {
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  height: 1rem;
  width: 1rem;
  display: inline-block;
  transition: all 0.5s ease-in-out;
  background: radial-gradient(
    100% 75% at 55%,
    rgba(223, 113, 255, 0.8) 0%,
    rgba(223, 113, 255, 0) 100%
  );
  box-shadow: 0 0 3px black;
  border-bottom-left-radius: 0.5rem;
  border-top-right-radius: var(--round);
}
.fold::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 150%;
  height: 150%;
  transform: rotate(45deg) translateX(0%) translateY(-18px);
  background-color: #e8e8e8;
  pointer-events: none;
}
.button:hover .fold {
  margin-top: -1rem;
  margin-right: -1rem;
}

.points_wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  z-index: 1;
}

.points_wrapper .point {
  bottom: -10px;
  position: absolute;
  animation: floating-points infinite ease-in-out;
  pointer-events: none;
  width: 2px;
  height: 2px;
  background-color: #fff;
  border-radius: 9999px;
}
@keyframes floating-points {
  0% {
    transform: translateY(0);
  }
  85% {
    opacity: 0;
  }
  100% {
    transform: translateY(-55px);
    opacity: 0;
  }
}
.points_wrapper .point:nth-child(1) {
  left: 10%;
  opacity: 1;
  animation-duration: 2.35s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(2) {
  left: 30%;
  opacity: 0.7;
  animation-duration: 2.5s;
  animation-delay: 0.5s;
}
.points_wrapper .point:nth-child(3) {
  left: 25%;
  opacity: 0.8;
  animation-duration: 2.2s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(4) {
  left: 44%;
  opacity: 0.6;
  animation-duration: 2.05s;
}
.points_wrapper .point:nth-child(5) {
  left: 50%;
  opacity: 1;
  animation-duration: 1.9s;
}
.points_wrapper .point:nth-child(6) {
  left: 75%;
  opacity: 0.5;
  animation-duration: 1.5s;
  animation-delay: 1.5s;
}
.points_wrapper .point:nth-child(7) {
  left: 88%;
  opacity: 0.9;
  animation-duration: 2.2s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(8) {
  left: 58%;
  opacity: 0.8;
  animation-duration: 2.25s;
  animation-delay: 0.2s;
}
.points_wrapper .point:nth-child(9) {
  left: 98%;
  opacity: 0.6;
  animation-duration: 2.6s;
  animation-delay: 0.1s;
}
.points_wrapper .point:nth-child(10) {
  left: 65%;
  opacity: 1;
  animation-duration: 2.5s;
  animation-delay: 0.2s;
}

.inner {
  z-index: 2;
  gap: 6px;
  position: relative;
  width: 100%;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  transition: color 0.2s ease-in-out;
}

.inner svg.icon {
  width: 18px;
  height: 18px;
  transition: fill 0.1s linear;
}

.button:focus svg.icon {
  fill: white;
}
.button:hover svg.icon {
  fill: transparent;
  animation: dasharray 1s linear forwards, filled 0.1s linear forwards 0.95s;
}
@keyframes dasharray {
  from {
    stroke-dasharray: 0 0 0 0;
  }
  to {
    stroke-dasharray: 68 68 0 0;
  }
}
@keyframes filled {
  to {
    fill: white;
  }
}
</style>
