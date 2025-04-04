<template>
  <div class="workBenchBox">
    <div class="top">
      <div class="left">
        <div class="myDiv" @click="toOpenDialog(1)">
          <span>加入会议</span>
          <span class="iconfont icon-add"></span>
        </div>
        <div class="myDiv" @click="toOpenDialog(2)">
          <span>快速会议</span>
          <span class="iconfont icon-video"></span>
        </div>
        <div class="myDiv" @click="toOpenDialog(3)">
          <span>预约会议</span>
          <span class="iconfont icon-list"></span>
        </div>
      </div>
      <div class="right">
        <div class="forumsBox">
          <ForumSmallCard
            v-for="item in recommendList"
            :post="item"
            @click="$router.push('/forum/' + item.id)"
          />
        </div>
        <button class="button">
          <svg
            t="1738334268196"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2354"
            width="24"
            height="24"
          >
            <path
              d="M512 166.4c-70.4 0-134.4 19.2-192 57.6L294.4 185.6C281.6 166.4 256 172.8 249.6 192L204.8 332.8C204.8 345.6 217.6 364.8 230.4 364.8l147.2-6.4c19.2 0 32-25.6 19.2-38.4L364.8 281.6l0 0 0-6.4C403.2 243.2 460.8 230.4 512 230.4c153.6 0 281.6 128 281.6 281.6s-128 281.6-281.6 281.6-281.6-128-281.6-281.6c0-19.2-12.8-32-32-32S166.4 492.8 166.4 512c0 192 153.6 345.6 345.6 345.6S857.6 704 857.6 512 704 166.4 512 166.4z"
              fill="#ffffff"
              p-id="2355"
            ></path>
          </svg>
          <span class="button__text">换一换</span>
        </button>
      </div>
    </div>
    <div class="bottom">
      <div class="reccomendMeetingsBox">
        <div class="title">会议推荐</div>
        <div class="meetingsBox">
          <Meeting v-for="item in 3" />
        </div>
      </div>
      <div class="scheduleBox">
        <div class="title">日程表</div>
        <Schedule />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="title" width="600">
    <el-form
      :model="addFormData"
      label-width="80px"
      label-position="top"
      v-if="status === 1"
    >
      <el-form-item label="会议编号">
        <el-input v-model="addFormData.id" placeholder="请输入编号"></el-input>
      </el-form-item>
      <el-form-item label="入会名称">
        <el-input
          v-model="addFormData.username"
          placeholder="请输入昵称"
        ></el-input>
      </el-form-item>
      <el-form-item label="会议设置">
        <el-checkbox
          v-model="addFormData.startWithAudioMuted"
          label="开启麦克风"
          size="large"
        />
        <el-checkbox
          v-model="addFormData.startWithVideoMuted"
          label="开启摄像头"
          size="large"
        />
      </el-form-item>
    </el-form>
    <span v-if="status === 2">您确定要开始快速会议吗</span>
    <el-form v-if="status === 3" :model="bookData" label-width="50px">
      <el-form-item label="主题">
        <el-input v-model="bookData.title" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="开始">
        <el-date-picker
          v-model="bookData.startTime"
          type="datetime"
          value-format="YYYY-MM-DD hh:mm:ss"
          placeholder="请选择具体时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="时长">
        <el-select v-model="bookData.duration" placeholder="">
          <el-option
            v-for="(item, index) in 9"
            :key="item"
            :label="(index + 1) * 15"
            :value="(index + 1) * 15"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提醒">
        <el-checkbox label="是否需要参会提醒" v-model="isRemind"></el-checkbox>
      </el-form-item>

      <el-form-item v-if="isRemind">
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :auto-upload="false"
          :on-change="changeRemind"
        >
          <el-button type="primary">上传参会人员</el-button>
          <div @click.stop="">
            <span style="margin: 0px 20px">提醒方式：</span>
            <el-radio-group v-model="remindType">
              <el-radio label="邮箱" :value="0"></el-radio>
              <el-radio label="短信" :value="1"></el-radio>
            </el-radio-group>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item v-if="isRemind" label="类型"> </el-form-item>

      <el-form-item label="方式">
        <el-radio-group v-model="bookData.meetingType">
          <el-radio label="线上" :value="1"></el-radio>
          <el-radio label="线下" :value="0"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="bookData.meetingType === 0" label="地址">
        <Map @change="getAddress"></Map>
      </el-form-item>

      <el-form-item label="隐私">
        <el-radio-group v-model="bookData.isprivate">
          <el-radio label="公开" :value="1"></el-radio>
          <el-radio label="私有" :value="0"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码">
        <el-checkbox label="是否需要密码" v-model="needPassword"></el-checkbox>
      </el-form-item>
      <el-form-item v-if="needPassword">
        <el-input v-model="bookData.password" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="文档">
        
        <el-upload
          v-model:file-list="meetingFileList"
          class="upload-demo"
          action=""
          multiple
          :limit="5"
        >
          <el-button type="primary">上传参会文档</el-button>
          <el-button
            @click.stop="generateVisible = true"
            type="primary"
            text="plain"
            >AI生成参会文档</el-button
          >
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="录制">
        <el-radio-group v-model="bookData.needRecord">
          <el-radio label="开启录制" :value="true"></el-radio>
          <el-radio label="关闭录制" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="toConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="generateVisible"
    width="600"
    title="ai生成参赛文档"
    append-to-body
  >
    <el-form :model="otherData" label-width="80" style="max-width: 540px">
      <!-- 联系方式 -->
      <el-form-item label="联系方式">
        <el-input v-model="otherData.contact_info" />
      </el-form-item>

      <!-- 主办方 -->
      <el-form-item label="主办方">
        <el-input v-model="otherData.host" />
      </el-form-item>

      <!-- 个人简介 -->
      <el-form-item label="会议简介">
        <el-input
          v-model="otherData.profile"
          type="textarea"
          :rows="3"
          placeholder="请输入会议简介"
        />
      </el-form-item>

      <!-- 相关资料 -->
      <el-form-item label="相关资料">
        <div class="key-value-list">
          <div
            v-for="(item, index) in relevantDataList"
            :key="index"
            class="list-item"
          >
            <el-input
              v-model="item.key"
              placeholder="名称"
              style="width: 200px; margin-right: 10px"
              @change="validateKey(index)"
            />
            <el-input
              v-model="item.value"
              placeholder="地址"
              style="width: 200px; margin-right: 10px"
            />
            <el-button
              type="danger"
              icon="Delete"
              circle
              @click="removeItem(index)"
            />
          </div>
          <el-button style="margin-top: 20px;" type="primary" @click="addItem">
            <el-icon><Plus /></el-icon>
            添加条目
          </el-button>
        </div>
      </el-form-item>

      <!-- 签到方式 -->
      <el-form-item label="签到方式">
        <el-input
          v-model="otherData.sign_in_type"
          type="textarea"
          :rows="3"
          placeholder="请输入签到方式"
        />
      </el-form-item>

      <!-- 交通方式 -->
      <!-- <el-form-item label="交通方式">
        <el-input
          v-model="otherData.transportation"
          placeholder="请输入交通方式"
        />
      </el-form-item> -->

      <el-form-item label="相关操作">
        <img
          v-if="isGenerate"
          src="../../assets/img/ai.gif"
          style="width: 80px; height: 80px"
          alt=""
        />
        <el-button v-if="!isGenerate" type="primary" @click="aiGenerate"
          >生成</el-button
        >
        <el-button v-if="generateResult !== ''" type="primary" @click="toView"
          >查看结果</el-button
        >
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="generateVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="aiGenerate"> 确认 </el-button> -->
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import ForumSmallCard from "../forum/components/forumSmallCard.vue";
import Meeting from "../workBench/components/meeting.vue";
import Schedule from "../workBench/components/schedule.vue";
import { onMounted, ref } from "vue";
import Map from "../components/Map.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { MeetingSettings, MeetingSetting, Post } from "@/types/home";
import { useMeetingStore } from "@/stores/meetingStore";
import {
  createMeetingAPI,
  joinMeetingAPI,
  meetingRemindAPI,
  quicklyMeetingAPI,
} from "@/apis/meeting";
import { useUserStore } from "@/stores/userStore";
import { getRecommendAPI } from "@/apis/forum";
import type { UploadFile } from "antd";
import { getGuideAPI } from "@/apis/aiMeeting";
import { useDownloadStore } from "@/stores/downlowdStore";

const router = useRouter();

// 1 加入会议 2 快速会议 3 预约会议
const status = ref(1);
const title = ref("");
const dialogVisible = ref(false);

const toOpenDialog = (i: number) => {
  status.value = i;
  title.value =
    status.value === 1
      ? "加入会议"
      : status.value === 2
      ? "快速会议"
      : "预约会议";

  dialogVisible.value = true;
};

// const form = ref();
const addFormData = ref<MeetingSettings>({
  id: 1,
  username: "",
  startWithAudioMuted: true,
  startWithVideoMuted: false,
});
// 是否需要密码
const needPassword = ref(false);
// 是否需要提醒
const isRemind = ref(false);
const remindType = ref(0);
const bookData = ref<MeetingSetting>({
  title: "",
  userId: 1,
  startTime: "",
  // 0线下 1线上
  meetingType: 0,
  address: "",
  lat: null,
  lng: null,
  password: "",
  // 0公有 1私有
  isprivate: 1,
  duration: 1,
});

const meetingStore = useMeetingStore();

const bookMeeting = async () => {
  const res = await createMeetingAPI(bookData.value);

  if (res.data.code === 200) {
    ElMessage.success("预约成功");

    uploadRemind(res.data.data);
  } else {
    ElMessage.error(res.data.message);
  }
};

const userStore = useUserStore();

const quicklyMeeting = async () => {
  const res = await quicklyMeetingAPI(userStore.user!.id);

  if (res.data.code === 200) {
    return res.data.data;
  } else ElMessage.error(res.data.message);
};

const toConfirm = async () => {
  switch (status.value) {
    case 1:
      {
        // console.log(addFormData.value);
        // meetingStore.setMeetingSetting(addFormData.value);
        // router.push("/jisit/" + addFormData.value.id);

        // 加入会议
        const res = await joinMeetingAPI(
          userStore.user.id,
          addFormData.value.id!
        );

        if (res.data.code === 200) {
          meetingStore.setMeetingSetting(addFormData.value);
          router.push("/jisit/" + addFormData.value.id);
        } else {
          ElMessage.error(res.data.message);
        }
      }
      break;
    case 2:
      {
        // 创建会议
        let id = await quicklyMeeting();
        meetingStore.setMeetingSetting({
          id: id,
        });
        router.push("/jisit/" + id);
      }
      break;
    case 3:
      {
        // 预约会议
        bookMeeting();
      }
      break;
  }

  dialogVisible.value = false;
};

// 参会文档
const meetingFileList = ref<UploadUserFile[]>([]);

// ai 生成参会文档

const isGenerate = ref(false);
const generateResult = ref("");
const downloadStore=useDownloadStore()

const aiGenerate = async () => {

  otherData.value.relevant_data=convertToRecord()

  isGenerate.value = true;

  const res = await getGuideAPI({
    address: bookData.value.address!,
    datetime: bookData.value.startTime,
    duration: bookData.value.duration + "",
    title: bookData.value.title,
    ...otherData.value,
  });

  isGenerate.value = false;
  console.log(res)
  if (res.data.status === 'success') {
    generateResult.value=res.data.data
    downloadStore.setContent(res.data.data)
  } else {
    ElMessage.error("出错了");
    generateVisible.value = false;
  }
};

const toView=()=>{
  window.open('/view')
}

const generateVisible = ref(false);
const otherData = ref({
  contact_info: userStore.user.phone,
  host: userStore.user.username,
  profile: "",
  relevant_data: {} as Record<string, string>,
  sign_in_type: "在线签到",
  transportation: "",
});

interface KeyValuePair {
  key: string;
  value: string;
}

const relevantDataList = ref<KeyValuePair[]>([{ key: "", value: "" }]);

// 添加条目
const addItem = () => {
  relevantDataList.value.push({ key: "", value: "" });
};

// 删除条目
const removeItem = (index: number) => {
  if (relevantDataList.value.length > 1) {
    relevantDataList.value.splice(index, 1);
  }
};

// 转换函数（在提交时调用）
const convertToRecord = (): Record<string, string> => {
  const result: Record<string, string> = {};

  relevantDataList.value.forEach((item) => {
    if (item.key.trim()) {
      // 过滤空key
      result[item.key.trim()] = item.value.trim();
    }
  });

  return result;
};

// 校验键名唯一性
const validateKey = (currentIndex: number) => {
  const currentKey = relevantDataList.value[currentIndex].key
  if (!currentKey) return

  const duplicateIndex = relevantDataList.value.findIndex(
    (item, index) => item.key === currentKey && index !== currentIndex
  )

  if (duplicateIndex !== -1) {
    ElMessage.warning(`键名 "${currentKey}" 已存在，请修改`)
    relevantDataList.value[currentIndex].key = ''
  }
}

const getAddress = (item: any) => {
  console.log(item);

  bookData.value.address = item.address;
  bookData.value.lat = item.lat;
  bookData.value.lng = item.lng;
};

// 获取推荐

const recommendList = ref<Post[]>();

const getRecommend = async () => {
  const res = await getRecommendAPI(userStore.user.id);

  if (res.status === 200) {
    recommendList.value = res.data.recommended_posts;
  } else ElMessage.error("获取失败");
};

// 参会提醒

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

const remindFile = ref();

const changeRemind = (uploadFile: UploadFile) => {
  console.log(uploadFile);
  remindFile.value = uploadFile.raw;

  fileList.value = [
    {
      name: uploadFile.name,
      url: URL.createObjectURL(uploadFile.originFileObj),
    },
  ];
};

const uploadRemind = async (id: number) => {
  if (!remindFile.value) {
    ElMessage.error("您为上传参会文档");
    return;
  }
  let data = new FormData();
  data.append("file", remindFile.value);
  const res = await meetingRemindAPI(id, remindType.value, data);

  if (res.data.code === 200) {
    ElMessage.success("上传参会文档成功");
  } else {
    ElMessage.error(res.data.message);
  }
};

onMounted(() => {
  getRecommend();
});
</script>

<style lang="scss" scoped>
.workBenchBox {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px;

  .top {
    display: flex;
    justify-content: left;

    .left {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-right: 20px;
    }

    .myDiv {
      width: 120px;
      height: 120px;
      background-color: $primary-background-color;
      border-radius: 20px;
      color: $primary-color;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      cursor: pointer;
      transition: all 0.4s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
          rgba(17, 17, 26, 0.1) 0px 8px 24px,
          rgba(17, 17, 26, 0.1) 0px 16px 56px;
      }

      span:nth-child(1) {
        font-weight: bold;
      }

      span:nth-child(2) {
        font-size: 32px !important;
      }
    }

    .right {
      display: flex;
      align-items: flex-end;

      .forumsBox {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-right: 20px;
      }

      .button {
        line-height: 1;
        height: 42px;
        background-color: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.35em;
        padding: 0.75em 1em;
        padding-right: 1.25em;
        color: #fff;
        border: 1px solid transparent;
        font-weight: 700;
        border-radius: 2em;
        font-size: 1rem;
        box-shadow: 0 0.7em 1.5em -0.5em hsla(249, 62%, 51%, 0.745);
        transition: transform 0.3s;

        background: linear-gradient(
          90deg,
          $primary-color,
          rgba(132, 116, 254, 1) 100%
        );
      }

      .button__icon {
        width: 1.5em;
        height: 1.5em;
      }

      .button:hover {
        border-color: #f4f5f2;
      }

      .button:active {
        transform: scale(0.98);
        box-shadow: 0 0.5em 1.5em -0.5em hsla(249, 62%, 51%, 0.745);
      }
    }
  }

  .bottom {
    display: flex;
    margin-top: 20px;
    margin-right: 20px;

    .title {
      font-size: 20px;
      font-weight: bold;
      color: $primary-color;
    }

    .reccomendMeetingsBox {
      flex: 1;
      margin-right: 20px;
      // border: 1px solid $primary-border-color;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 20px;

      .meetingsBox {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
    }

    .scheduleBox {
      width: 420px;
      min-height: 500px;
      // border: 1px solid $primary-border-color;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 20px;
    }
  }
}
</style>
