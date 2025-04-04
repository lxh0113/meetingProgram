<template>
  <div class="userBox">
    <div class="left">
      <div class="top">
        <el-avatar :src="userStore.user!.avatar" :size="90">user</el-avatar>
        <span class="userName">{{ userData.username }}</span>
      </div>
      <div class="bottom">
        <span>帖子 {{ userData.postCount }}+</span>
        <span>获赞 {{ userData.likeCount }}+</span>
      </div>
    </div>
    <div class="center">
      <div class="title">个人信息</div>
      <el-form label-position="top">
        <div class="avatar">
          <el-form-item label="头像">
            <el-upload
              v-model:file-list="fileList"
              :action="baseUrl + '/oss/avatar'"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :limit="1"
              :on-success="handleAvatarSuccess"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </div>
        <div class="twoInput">
          <el-form-item label="名字" style="flex: 1; margin-right: 20px">
            <el-input v-model="userData.username" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="性别" style="flex: 1">
            <el-input v-model="userData.sex" placeholder=""></el-input>
          </el-form-item>
        </div>
        <div class="twoInput">
          <el-form-item
            label="电子邮件地址"
            style="flex: 1; margin-right: 20px"
          >
            <el-input v-model="userData.email" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="电话号码" style="flex: 1">
            <el-input v-model="userData.phone" :auto-complete="false" placeholder=""></el-input>
          </el-form-item>
        </div>
        <div class="twoInput">
          <el-form-item label="新密码" style="flex: 1; margin-right: 20px">
            <el-input
              v-model="newPassword"
              :auto-complete="false"
              type="password"
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" style="flex: 1">
            <el-input
              style="width: 135px; margin-right: 20px"
              v-model="captcha"
              placeholder=""
            ></el-input>
            <el-button type="primary" @click="getCatpcha">{{
              captchaText
            }}</el-button>
          </el-form-item>
        </div>
        <div class="twoInput">
          <el-button
            style="width: 100%; margin-top: 20px"
            type="primary"
            @click="submit"
            >提交</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="right">
      <span class="title">历史会议</span>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="会议编号" />
        <el-table-column prop="title" label="会议主题" />
        <el-table-column prop="creator" label="创建人" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="toView(scope.row.url)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

import { ElMessage, type UploadProps, type UploadUserFile } from "element-plus";
import { getUserInfoAPI, updateAPI } from "@/apis/users";
import { useUserStore } from "@/stores/userStore";
import type { UserInfo } from "@/types/home";
import { baseUrl } from "@/utils/baseUrl";
import { sendVerificationCodeAPI } from "@/apis/email";
import { emailRegexp } from "@/utils/regexp";
import { getHistoryMeetingAPI } from "@/apis/meeting";

const newPassword = ref("");
const userData = ref<UserInfo>({
  id: 1,
  account: "",
  avatar: "",
  email: "",
  phone: "",
  sex: "",
  username: "",
  likeCount: 1,
  postCount: 1,
  postIds: [],
  meetingIds: [],
});

const captcha = ref<string | null>("");

const fileList = ref<UploadUserFile[]>([
  {
    name: "1.jpeg",
    url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  },
]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const userStore = useUserStore();

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log(response.data);
  userData.value.avatar = response.data;
  userStore.setUserInfo({
    ...userStore.user!,
    avatar: response.data,
  });

  submit();
};

const getUserInfo = async () => {
  const res = await getUserInfoAPI(userStore.user!.account);

  if (res.data.code === 200) {
    console.log(res.data.data);
    userData.value = res.data.data;
    fileList.value[0].url = userData.value.avatar;
  } else ElMessage.error("获取出错");
};

let second = 60;
const captchaText = ref("获取验证码");

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

  if (!emailRegexp.test(userData.value.email)) {
    ElMessage.error("邮箱格式错误");
    return;
  }

  const res = await sendVerificationCodeAPI(userData.value.email);

  if (res.data.code === 200) {
    changeCaptchaText();
    ElMessage.success("验证码已发送");
  } else {
    ElMessage.error(res.data.message);
  }
};

const submit = async () => {
  const res = await updateAPI(captcha.value, {
    account: userData.value.account,
    avatar: userData.value.avatar,
    email: userData.value.email,
    phone: userData.value.phone,
    sex: userData.value.sex,
    username: userData.value.username,
    password: userData.value.password,
  });

  if (res.data.code === 200) {
    ElMessage.success("修改成功");
    userStore.setUserInfo(userData.value);
  } else {
    ElMessage.error(res.data.message);
  }
};

// 历史会议

const tableData = ref([]);

const getHistoryMeetings = async () => {
  const res = await getHistoryMeetingAPI(userStore.user.id);

  if (res.data.code === 200) {
    tableData.value = res.data.data;
  } else {
    ElMessage.error(res.data.message);
  }
};

const toView = (url: string) => {
  const encodedPath = encodeURIComponent(encodeURIComponent(url));
  window.open("/history/" + encodedPath);
};

onMounted(() => {
  getUserInfo();
  getHistoryMeetings();
});
</script>

<style lang="scss" scoped>
.userBox {
  box-sizing: border-box;
  padding: 20px;
  display: flex;

  > .left {
    width: 300px;
    height: 300px;
    border: 1px solid $primary-border-color;
    border-radius: 10px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;

    > .top {
      margin-top: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .userName {
        margin-top: 20px;
      }
    }

    > .bottom {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;

      span {
        color: $primary-color;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  > .center {
    width: 600px;
    height: 620px;
    margin-left: 20px;
    border: 1px solid $primary-border-color;
    border-radius: 10px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    padding: 20px;
    box-sizing: border-box;

    > .title {
      margin-bottom: 10px;
    }

    .twoInput {
      display: flex;
    }
  }

  > .right {
    flex: 1;
    margin-left: 20px;
    border: 1px solid $primary-border-color;
    border-radius: 10px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;
    padding: 20px;
    box-sizing: border-box;

    > .title {
      color: $primary-color;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
}
</style>
