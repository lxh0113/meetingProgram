import { defineStore } from "pinia";
import { ref } from "vue";

export const useDownloadStore = defineStore(
  "myDownload",
  () => {
    const content = ref<string>("这是内容部分");

    const setContent = (data: string) => {
    //   console.log("---setdata");
    //   console.log(data);
      content.value = data;
    };

    const getContent = () => {
      return content.value;
    };

    return {
      content,
      setContent,
      getContent,
    };
  },
  {
    persist: {
      //   enabled: true,
      storage: localStorage,
    },
  }
);
