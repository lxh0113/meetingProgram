<template>
  <div class="myCardBox" @click="toForum">
    <span class="title">{{ props.data.label }}</span>
    <span class="delete">
      <el-button
        style="border: none; border-radius: 0px"
        :icon="Edit"
        type="success"
        plain
        @click.stop="editPost"
      ></el-button>
      <el-button
        style="border-top-right-radius: 10px; border: none; margin-left: 0"
        :icon="Delete"
        type="primary"
        plain
        @click.stop="deletePost"
      ></el-button>
    </span>
    <el-text
      line-clamp="5"
      style="width: 100%; text-indent: 2rem; height: 180px"
      v-html="props.data.content"
    >
    </el-text>
    <div class="bottom">
      <span class="details">
        <span class="iconfont icon-eye"></span>
        <span>{{ props.data.views }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-like"></span>
        <span>{{ props.data.likes }}</span>
      </span>
      <span class="details">
        <span class="iconfont icon-star"></span>
        <span>{{ props.data.favorites }}</span>
      </span>
      <el-tag type="primary" v-if="props.data.status === '0'">待审核</el-tag>
      <el-tag type="success" v-else-if="props.data.status === '1'"
        >已发布</el-tag
      >
      <el-tag type="danger" v-else>存在违规内容</el-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { deletePostAPI } from "@/apis/forum";
import { useUserStore } from "@/stores/userStore";
import type { Post } from "@/types/home";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["delete"]);

const props = withDefaults(
  defineProps<{
    data: Post;
  }>(),
  {}
);

const toForum = () => {
  router.push("/forum/" + props.data.id);
};

const userStore = useUserStore();

const editPost = () => {
  router.push("/forum/publish/" + props.data.id);
};

const deletePost = async (e: any) => {
  let flag = confirm("您确定要删除当前帖子吗");

  if (!flag) return;

  const res = await deletePostAPI(props.data.id, userStore.user!.id);

  if (res.data.code === 200) {
    ElMessage.success("删除成功");
    emit("delete");
  } else ElMessage.error("删除失败");
};
</script>

<style lang="scss" scoped>
.myCardBox {
  display: flex;
  flex-direction: column;
  height: 240px;
  padding: 20px;
  border: 1px solid $primary-border-color;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;
  position: relative;

  transition: all 0.4s;

  .delete {
    position: absolute;
    right: 0;
    top: 0;
    // opacity: 0;
    display: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    .delete {
      display: block;
    }
  }

  .title {
    color: $primary-color;
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 6px;
  }

  .bottom {
    margin-top: 5px;
    display: flex;
    align-items: center;
  }

  .details {
    margin-right: 15px;
    font-size: 14px;
    height: 15px;
    display: flex;
    align-items: center;

    span:nth-child(1) {
      color: $primary-color;
      margin-right: 5px;
    }

    span:nth-child(2) {
      font-size: 14px !important;
    }
  }
}
</style>
