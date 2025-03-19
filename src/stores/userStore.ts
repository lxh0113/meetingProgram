import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/types/home";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User>({
      id: 1,
      account: "string",
      avatar: "string",
      email: "string",
      phone: "string",
      sex: "string",
      username: "string",
      password: "string",
    });

    const setUserInfo = (newInfo: User) => {
      user.value = newInfo;
    };

    return {
      user,
      setUserInfo,
    };
  },
  {
    persist: {
      // enabled: true,
      storage: localStorage,
    },
  }
);
