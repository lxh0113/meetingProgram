import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { MeetingSettings } from "@/types/home";

export const useMeetingStore = defineStore(
  "meeting",
  () => {

    const meetingSettings=ref<MeetingSettings>()

    const setMeetingSetting=(data:MeetingSettings)=>{
        meetingSettings.value=data
    }

    return {
        meetingSettings,
        setMeetingSetting
    };
  },
  {
    persist: {
    //   enabled: true,
      storage: localStorage,
    },
  }
);
