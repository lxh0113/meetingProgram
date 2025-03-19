<template>
  <div class="userBox">
    <div class="top">
      <div class="left">
        <div class="myBox">
          <div class="text">
            <span class="title"> 在线人数 </span>
            <span style="color: #fdde69">18</span>
          </div>
          <div class="picture">
            <el-progress
              style=""
              type="circle"
              width="100"
              :percentage="52"
              :stroke-width="10"
              color="#fdde69"
            />
          </div>
        </div>
        <div class="myBox">
          <div class="text">
            <span class="title"> 新用户 </span>
            <span style="color: #3578f6">22</span>
          </div>
          <div class="picture">
            <el-progress
              style=""
              type="circle"
              width="100"
              :percentage="65"
              :stroke-width="10"
              color="#3578f6"
            />
          </div>
        </div>
        <div class="myBox">
          <div class="text">
            <span class="title"> 平均每日会议 </span>
            <span style="color: #62ca76">22</span>
          </div>
          <div class="picture">
            <el-progress
              style=""
              type="circle"
              width="100"
              :percentage="33"
              :stroke-width="10"
              color="#62ca76"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <span class="title">各时间使用人数</span>
        <div id="timePic" style="width: 100%; height: 100%"></div>
      </div>
    </div>
    <div class="bottom">
      <el-input
        v-model="serachText"
        placeholder="请输入用户名"
        :prefix-icon="Search"
        style="width: 300px"
        @keyup.enter="getUsers"
      ></el-input>
      <div
        v-if="tableData.length === 0"
        style="display: flex; justify-content: center"
      >
        <el-empty description="无数据" />
      </div>
      <el-table v-else :data="tableData" style="width: 100%">
        <el-table-column prop="account" label="账户" />
        <el-table-column prop="username" label="名称" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar">user</el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="danger" @click="deleteUser(scope.row.account)"
              >冻结</el-button
            >
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
          :current-change="getUsers"
          :page-size="pageData.pageSize"
          :current-page="pageData.currentPage"
          :total="pageData.total"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { adminDeleteUsersAPI, adminGetUsersAPI } from "@/apis/admin";
import type { User } from "@/types/home";
import { Search } from "@element-plus/icons-vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const tableData = ref<Array<User>>([]);
const serachText = ref("");
const pageData = ref({
  currentPage: 1,
  total: 1,
  pageSize: 8,
});

const initPic = () => {
  var myChart = echarts.init(document.getElementById("timePic"));
  // 绘制图表
  myChart.setOption({
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["8:00", "12:00", "16:00", "20:00", "24:00", "4:00"],
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false, // 不显示网格线
      },
    },
    grid: {
      x: 20,
      y: 20,
      x2: 20,
      y2: 20,
    },
    series: [
      {
        data: [32, 12, 45, 25, 22, 12],
        type: "line",
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(53, 120, 246,0.8)",
            },
            {
              offset: 1,
              color: "rgba(53, 120, 246,0.3)",
            },
          ]),
        },
        smooth: true,
      },
    ],
  });
};

const getUsers = async () => {
  const res = await adminGetUsersAPI(
    serachText.value,
    pageData.value.currentPage
  );

  if (res.data.code === 200) {
    tableData.value = res.data.data.users;
    pageData.value.total = res.data.data.totalUsers;
  } else {
    ElMessage.error(res.data.message);
  }
};

const deleteUser = async (account: string) => {
  const res = await adminDeleteUsersAPI(account);
  if (res.data.code === 200) {
    ElMessage.success('冻结用户成功')
    getUsers();
  } else {
    ElMessage.error(res.data.message);
  }
};

onMounted(() => {
  initPic();
  getUsers();
});
</script>

<style lang="scss" scoped>
.userBox {
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
        box-sizing: border-box;
        padding: 30px;
        border-radius: 20px;
        border: 1px solid $primary-border-color;
        justify-content: space-between;
        transition: all 0.5s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
            rgba(17, 17, 26, 0.1) 0px 8px 24px,
            rgba(17, 17, 26, 0.1) 0px 16px 56px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-right: 20px;

          .text {
            font-size: 18px;
          }

          span:nth-child(2) {
            font-size: 22px;
          }
        }
      }
    }

    > .right {
      border: 1px solid $primary-border-color;
      margin-left: 20px;
      border-radius: 20px;
      width: 600px;
      box-sizing: border-box;
      padding: 20px;
      transition: all 0.5s;

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
    }
  }

  .bottom {
    margin-top: 20px;
  }
}
</style>
