<template>
  <div class="loginBack">
    <img src="../../assets/img/loginTop.png" alt="" class="loginTopImage" />
    <img
      src="../../assets/img/loginBottom.png"
      alt=""
      class="loginBottomImage"
    />
    <div class="center">
      <div class="loginBox">
        <h3>欢迎登录智会通</h3>
        <h6>WELCOME</h6>
        <el-form
          :model="registerData"
          :rules="rules"
          size="large"
          style="max-width: 360px; margin: 20px auto"
        >
          <el-form-item prop="email">
            <el-input
              :prefix-icon="Message"
              style="height: 50px"
              v-model="registerData.email"
              placeholder="请输入email"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              style="height: 50px"
              class="loginInput"
              v-model="registerData.password"
              placeholder="请输入密码"
              type="password"
            />
          </el-form-item>
          <el-form-item style="display: flex" prop="captcha">
            <el-input
              :prefix-icon="Unlock"
              style="height: 50px; width: 238px"
              v-model="registerData.captcha"
              placeholder="请输入验证码"
            />
            <el-button
              @click="getCatpcha"
              style="height: 50px; margin-left: 10px"
              type="primary"
              >{{ captchaText }}</el-button
            >
          </el-form-item>
          <el-form-item style="display: flex; margin-bottom: 40px">
            <el-checkbox-group style="flex: 1; text-align: left">
              <el-checkbox> 记住密码 </el-checkbox>
            </el-checkbox-group>
            <p>
              已有账号，<span
                @click="$router.push('/login')"
                style="color: #3578f6; font-weight: bold; cursor: pointer"
                >去登录</span
              >
            </p>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 360px; height: 50px"
              type="primary"
              @click="register"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <img class="right" src="../../assets/img/loginImage.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sendVerificationCodeAPI } from "@/apis/email";
import { registerAPI } from "@/apis/users";
import { useUserStore } from "@/stores/userStore";
import type { User } from "@/types/home";
import { Lock, Message, Unlock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { captchaRegexp, emailRegexp, passwordRegexp } from "@/utils/regexp";

interface registerRule {
  email: string;
  password: string;
  captcha: string;
}

const registerData = ref<registerRule>({
  email: "",
  password: "",
  captcha: "",
});

const rules = reactive<FormRules<registerRule>>({
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      pattern: emailRegexp,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      pattern: passwordRegexp,
      message: "至少包含字母、数字、其他字符，8-16位",
      trigger: "change",
    },
  ],
  captcha: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
    {
      pattern: captchaRegexp,
      message: "验证码是6位数字",
      trigger: "change",
    },
  ],
});

let second = 60;
const captchaText = ref("获取验证码");

const userStore = useUserStore();

const changeCaptchaText = () => {
  let timer = setInterval(() => {
    second--;
    if (second < 0) {
      clearInterval(timer);
      second = 60;
      captchaText.value = "获取验证码";
    } else captchaText.value = "还剩下" + second + "秒";
  }, 1000);
};

const getCatpcha = async () => {
  if (captchaText.value !== "获取验证码") {
    ElMessage.error("验证码已发送");
    return;
  }

  if (!emailRegexp.test(registerData.value.email)) {
    ElMessage.error("邮箱格式错误");
    return;
  }

  const res = await sendVerificationCodeAPI(registerData.value.email);

  if (res.data.code === 200) {
    changeCaptchaText();
    ElMessage.success("验证码已发送");
  } else {
    ElMessage.error(res.data.message);
  }
};

const register = async () => {
  const res = await registerAPI({
    email: registerData.value.email,
    password: registerData.value.password,
    emailCaptcha: registerData.value.captcha,
  });

  if (res.data.code === 200) {
    let { id, account, avatar, email, phone, sex, username }: User = {
      ...res.data.data,
    };
    userStore.setUserInfo({
      id,
      account,
      avatar,
      email,
      phone,
      sex,
      username,
    });

    setTimeout(() => {
      ElMessage.success("注册成功");
    });
  } else ElMessage.error("注册失败");
};
</script>

<style lang="scss">
.loginBack {
  background-color: white;
  background-attachment: fixed;
  min-width: 100vw;
  min-height: 100vh;
  position: relative;

  .loginTopImage {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 45%;
    object-fit: contain;
  }

  .loginBottomImage {
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 60%;
  }

  .center {
    height: 100vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;

    .loginBox {
      width: 480px;
      height: 540px;
      opacity: 0.8;
      border-radius: 20px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 10px 40px rgba(158, 195, 255, 0.51);
      margin-left: 200px;

      text-align: center;

      h3 {
        margin-top: 50px;
        font-size: 28px;
        font-weight: 600;
      }

      h6 {
        font-size: 20px;
        font-weight: 300;
        line-height: 50px;
      }
    }

    .right {
      max-width: calc(100vw - 900px);
      z-index: 3;
      max-width: 45%;
      margin-top: 100px;
      margin-right: 80px;
    }
  }
}
</style>
