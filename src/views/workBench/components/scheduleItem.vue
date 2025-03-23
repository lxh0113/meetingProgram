<template>
  <div class="scheduleItemBox">
    <div class="top">
      <div class="left">
        <el-avatar :src="props.schedule.url">
          {{ props.schedule.title.slice(0, 1) }}
        </el-avatar>
      </div>
      <div class="center">
        <div class="meetingName">{{ props.schedule.title }}</div>
        <div class="peopleCount">
          参与人员{{ props.schedule.usercount || 0 }}人
        </div>
      </div>
      <div class="right">
        <el-tag v-if="props.schedule.status === 0" type="primary">等待</el-tag>
        <el-tag v-else-if="props.schedule.status === 1" type="success"
          >进行中</el-tag
        >
        <el-tag v-else type="danger">结束</el-tag>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <el-icon :size="24"><Timer /></el-icon>
        <span class="detailsText">{{ props.schedule.startTime }}</span>
      </div>
      <div class="users">
        <el-text v-if="props.schedule.status === 0" class="mx-1" type="danger"
          >{{ getRestTime() }}后开始</el-text
        >
        <!-- <el-avatar> user </el-avatar>
        <el-avatar style="margin-left: -10px"> user </el-avatar>
        <el-avatar style="margin-left: -10px"> user </el-avatar> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Schedule } from "@/types/home";

const props = withDefaults(
  defineProps<{
    schedule: Schedule;
  }>(),
  {}
);

const getRestTime = () => {
  const now = new Date();
  const startTime = new Date(props.schedule.startTime);
  const remaining = startTime.getTime() - now.getTime();

  if (remaining <= 0) {
    return "0分钟"; // 或自定义过期提示
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;

  // 计算天数
  const days = Math.floor(remaining / oneDay);
  if (days > 0) {
    return `${days}天`;
  }

  // 计算小时
  const hours = Math.floor(remaining / oneHour);
  if (hours > 0) {
    return `${hours}小时`;
  }

  // 计算分钟
  const minutes = Math.floor(remaining / oneMinute);
  return `${minutes}分钟`;
};
</script>

<style lang="scss" scoped>
.scheduleItemBox {
  box-sizing: border-box;
  padding: 20px;
  margin-top: 10px;
  border: 1px solid $primary-border-color;

  transition: all 0.4s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
      rgba(17, 17, 26, 0.05) 0px 8px 32px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px dotted $primary-border-color;
    padding-bottom: 20px;

    > .left {
      width: 60px;
    }

    > .center {
      flex: 1;
    }

    > .right {
      width: 100px;
      display: flex;
      justify-content: center;
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    > .left {
      display: flex;
      align-items: center;
      color: $primary-gray-text-color;

      .detailsText {
        margin-left: 10px;
      }
    }
  }
}
</style>
