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
          :rules="rules"
          :model="loginData"
          size="large"
          style="max-width: 360px; margin: 40px auto"
        >
          <el-form-item prop="account">
            <el-input
              :prefix-icon="User"
              style="height: 50px"
              v-model="loginData.account"
              placeholder="请输入登录账号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              style="height: 50px"
              class="loginInput"
              v-model="loginData.password"
              placeholder="请输入登录密码"
            />
          </el-form-item>
          <el-form-item
            style="
              display: flex;
              margin-bottom: 60px;
              justify-content: space-between;
            "
          >
            <el-checkbox style="flex: 1" v-model="remember">
              管理员登录
            </el-checkbox>
            <p>
              没有账号，<span
                @click="$router.push('/register')"
                style="color: #3578f6; font-weight: bold; cursor: pointer"
                >去注册</span
              >
            </p>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="login"
              style="width: 360px; height: 50px"
              type="primary"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <img class="right" src="../../assets/img/loginImage.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginAPI } from "@/apis/users";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import type { FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { adminLoginAPI } from "@/apis/admin";

const userStore = useUserStore();

interface RuleForm {
  account: string;
  password: string;
}

const remember = ref(false);

const loginData = ref<RuleForm>({
  account: "",
  password: "",
});

const rules = reactive<FormRules<RuleForm>>({
  account: [{ required: true, message: "账号不能为空", trigger: "change" }],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "change",
    },
  ],
});

const router = useRouter();

const login = async () => {
  if (remember.value === true) {
    //  是否管理员
    const res = await adminLoginAPI(
      loginData.value.account,
      loginData.value.password
    );
    console.log(res.data);

    if (res.data.code === 200) {
      ElMessage.success("登陆成功");
      userStore.setUserInfo(res.data.data);
      setTimeout(() => {
        router.push("/back");
      });
    } else {
      const res = await loginAPI(
        loginData.value.account,
        loginData.value.password
      );
      console.log(res.data);

      if (res.data.code === 200) {
        ElMessage.success("登陆成功");
        userStore.setUserInfo(res.data.data);
        setTimeout(() => {
          router.push("/");
        }, 200);
      } else ElMessage.error("登录失败");
    }
  }
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
