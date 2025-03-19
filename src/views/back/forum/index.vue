<template>
  <div class="forumBox">
    <div class="top">
      <div class="left">
        <div class="myBox">
          <div class="text">
            <span class="number">
              128
            </span>
            <span class="description">在线帖主</span>
          </div>
          <div class="svg">
            <div class="border">
              <el-icon :size="20" style="color: white;"><Document /></el-icon>
            </div>
          </div>
        </div>

        <div class="myBox">
          <div class="text">
            <span class="number">
              21.3K
            </span>
            <span class="description">今日帖子访问量</span>
          </div>
          <div class="svg">
            <div class="border">
              <el-icon :size="20" style="color: white;"><Document /></el-icon>
            </div>
          </div>
        </div>

        <div class="myBox">
          <div class="text">
            <span class="number">
              1200
            </span>
            <span class="description">活跃用户</span>
          </div>
          <div class="svg">
            <div class="border">
              <el-icon :size="20" style="color: white;"><Document /></el-icon>
            </div>
          </div>
        </div>
       
      </div>
      <div class="right">
        <span class="title">论坛热词</span>
        <img
          src="./1.jpg"
        ></img>
      </div>
    </div>
    <div class="bottom">
      <!-- <el-button type="primary" :icon="View" @click="getRank">查看排行榜</el-button> -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="label" label="名称" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar">user</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览" />
        <el-table-column prop="likes" label="点赞" />
        <el-table-column prop="favorites" label="收藏" />
        <el-table-column prop="comments" label="回帖数量" />
        <el-table-column label="操作" width="320" align="center">
          <template #default="scope" >
            <el-button type="success" @click="changeStatus(scope.row.id,1)">通过</el-button>
            <el-button type="danger" @click="changeStatus(scope.row.id,2)">不通过</el-button>
            <el-button type="primary" @click="$router.push('/forum/'+scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div
        v-if="tableData.length"
        style="display: flex; justify-content: center;margin-top: 20px;"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="getPost"
          :page-size="pageData.pageSize"
          :current-page="pageData.currentPage"
          :total="pageData.total"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { adminGetAllPostAPI, adminUpdatePostStatusAPI } from "@/apis/admin";
import type { AdminPost } from "@/types/home";
import { number } from "echarts";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const tableData = ref<Array<AdminPost>>([]);

const pageData=ref({
  currentPage:1,
  total:1,
  pageSize:8
})

const getPost=async()=>{
  const res = await adminGetAllPostAPI(pageData.value.currentPage)

  if(res.data.code===200){
    tableData.value=res.data.data.postList
    pageData.value.total=res.data.data.totalPages
  }
  else {
    ElMessage.error(res.data.message)
  }
}

const changeStatus=async (id:number,status:number)=>{
  const res = await adminUpdatePostStatusAPI(id,status);

  if(res.data.code===200){
    ElMessage.success('操作成功')
    getPost()
  }
  else ElMessage.error(res.data.message)
}

onMounted(() => {
  getPost()
});
</script>

<style lang="scss" scoped>
.forumBox {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;

  .top {
    display: flex;

    > .left {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;

      .myBox {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 20px;
        color:white;
        background: linear-gradient(134.72deg, rgb(247, 72, 95) 0%, rgba(255, 138, 72, 1) 100%);
        border-radius: 20px;
        transition: all .5s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
            rgba(17, 17, 26, 0.1) 0px 8px 24px,
            rgba(17, 17, 26, 0.1) 0px 16px 56px;
        }

        .text{
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 20px;

          .number{
            font-size: 24px;
            font-weight: bold;
          }

          .description{
            margin-top: 10px;
          }
        }

        .svg{

          .border{
            background-color: rgba($color: #fff, $alpha:0.4);
            padding: 10px;
            border-radius: 50%;
          }
        }
      }

      .myBox:nth-child(2){
        background: linear-gradient(134.72deg, rgba(98, 202, 118, 1) 0%, rgba(34, 204, 226, 1) 100%);
      }

      .myBox:nth-child(3){
        background: linear-gradient(134.72deg, rgba(63, 126, 246, 1) 0%, rgba(34, 204, 226, 1) 100%);
      }
    }

    > .right {
      border: 1px solid $primary-border-color;
      margin-left: 20px;
      border-radius: 20px;
      width: 600px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 160px;
      box-sizing: border-box;
      overflow: hidden;
      transition: all .5s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
            rgba(17, 17, 26, 0.1) 0px 8px 24px,
            rgba(17, 17, 26, 0.1) 0px 16px 56px;
        }

      .title {
        font-weight: bold;
        color: $primary-color;
      }

      img{
        height: 100px;
      }
    }
  }

  .bottom {
    margin-top: 20px;
  }
}
</style>
