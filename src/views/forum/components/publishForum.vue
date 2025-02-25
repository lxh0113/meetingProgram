<template>
  <div class="publishForumBox">
    <div class="left">
      <myEditor
        :content="data.content"
        :title="data.label"
        @getContent="toPublish"
      />
    </div>
    <div class="right">
      <Ai />
    </div>
  </div>
</template>

<script lang="ts" setup>
import myEditor from "./myEditor.vue";
import Ai from "./ai.vue";
import type { PublishPost } from "@/types/home";
import { onMounted, ref } from "vue";
import { addPostAPI, getPostByIdAPI, updatePostAPI } from "@/apis/forum";
import { useUserStore } from "@/stores/userStore";
import { dayjs, ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";

const data = ref<PublishPost>({
  createTime: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
  views: 0,
  likes: 0,
  favorites: 0,
  label: "",
  content: "",
});

const userStore = useUserStore();

const router = useRouter();

// 更新文章
const toUpdate = async (value: any) => {
  let flag = confirm("你确定要更新并发布该帖子吗");

  if (!flag) return;

  data.value.label = value.title;
  data.value.content = value.content;

  data.value.createTime = dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss");

  const res = await updatePostAPI(
    parseInt(route.params.id as string),
    data.value
  );

  if (res.data.code === 200) {
    ElMessage.success("更新成功");
    setTimeout(() => {
      router.push("/forum/my");
    });
  } else ElMessage.error("更新失败");
};

// 在这里发布文章
const toPublish = async (value: any) => {
  if (route.params.id !== "undefined") {
    toUpdate(value);
    return;
  }

  data.value.label = value.title;
  data.value.content = value.content;

  let flag = confirm("你确定要发布该帖子吗");

  if (!flag) return;

  data.value.createTime = dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss");

  const res = await addPostAPI(userStore.user!.id, data.value);

  if (res.data.code === 200) {
    ElMessage.success("发布成功");
    setTimeout(() => {
      router.push("/forum");
    });
  } else {
    ElMessage.error("发布失败");
  }
};

const route = useRoute();

const getDetails = async (id: number) => {
  const res = await getPostByIdAPI(id, 1);

  if (res.data.code === 200) {
    data.value = {
      createTime: dayjs(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      views: res.data.data.views,
      likes: res.data.data.likes,
      favorites: res.data.data.favorites,
      label: res.data.data.label,
      content: res.data.data.content,
    };
    console.log(data.value);
  } else ElMessage.error("获取出错");
};

const setContent = () => {
  if (route.params.id !== "undefined") {
    console.log(route.params.id);
    getDetails(parseInt(route.params.id as string));
  }
};

onMounted(() => {
  setContent();
});
</script>

<style lang="scss" scoped>
.publishForumBox {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 20px;
  // background-color: red;

  .left {
    flex: 1;
    height: 100%;
    margin-right: 20px;
    // background-color: red;
  }

  .right {
    width: 540px;
    margin-right: 20px;
    box-sizing: border-box;
  }
}
</style>
