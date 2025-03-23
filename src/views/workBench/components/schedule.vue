<template>
  <div class="myScheduleBox">
    <ScheduleItem v-for="item in scheduleData" :schedule="item" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ScheduleItem from "../components/scheduleItem.vue";
import type { ScheduleList } from "@/types/home";
import { getCalendarAPI } from "@/apis/meeting";
import { useUserStore } from "@/stores/userStore";

const scheduleData = ref<ScheduleList>([]);

const userStore = useUserStore();

const getSchedules = async () => {
  const res = await getCalendarAPI(userStore.user.id);

  if (res.data.code === 200) {
    scheduleData.value = res.data.data;
  }
};

onMounted(() => {
  getSchedules();
});
</script>

<style lang="scss" scoped>
.myScheduleBox {
  display: flex;
  flex-direction: column;
}
</style>
