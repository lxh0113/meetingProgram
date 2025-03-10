<template>
  <div class="rankBox">
    <span class="title">
      <img style="width: 50px" src="../img/fire.gif" alt="" />
      <span>排行榜热度前20</span>
    </span>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="排名" align="center">
        <template #default="scope">
          <img
            v-if="scope.$index < 3"
            style="width: 70px"
            :src="rank[scope.$index]"
            alt=""
          />

          <span v-else class="rank">
            {{ scope.$index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="lable" label="标题" align="center" />
      <el-table-column prop="attentionCount" label="关注度" align="center" />
      <el-table-column prop="userInfo[username]" label="用户名" align="center" />
      <el-table-column label="头像" align="center">
        <template #default="scope">
          <el-avatar :src="scope.row.userInfo.avatar">user</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="userInfo[likeCount]" align="center" label="作者获赞数" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="success" @click="toView(scope.row.postId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import first from "../img/1.png";
import second from "../img/2.png";
import third from "../img/3.png";
import { getRankingAPI } from "@/apis/forum";
import { ElMessage } from "element-plus";
import type { RankPost } from "@/types/home";
import { useRouter } from "vue-router";

const rank = ref([first, second, third]);

const tableData = ref<Array<RankPost>>([]);

const getRank = async () => {
  const res = await getRankingAPI();

  if (res.data.code === 200) {
    tableData.value=res.data.data
  } else {
    ElMessage.error(res.data.message);
  }
};

const router=useRouter()

const toView=(id:number)=>{
    router.push('/forum/'+id)
}

onMounted(() => {
  getRank();
});
</script>

<style lang="scss" scoped>
.rankBox {
  box-sizing: border-box;
  padding: 20px;

  .title {
    color: $primary-color;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .rank {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    justify-content: center;
  }
}
</style>
