<template>
  <div class="userBox">
    <div class="top">
      <el-tag
        type="danger"
        style="margin-right: 10px; margin-bottom: 10px"
        v-for="item in tableData"
        closable
        @close="deleteBadWordById(item.id)"
        >{{ item.word }}</el-tag
      >
      <div
        v-if="tableData?.length === 0"
        style="width: 100%; display: flex; justify-content: center"
      >
        <el-empty description="无数据" />
      </div>
    </div>
    <div class="bottom">
      <el-input
        v-model="searchText"
        placeholder="请输入你所需要查询的违禁词"
        @keyup.enter="searchBadWord"
        :prefix-icon="Search"
        style="width: 240px; margin-right: 20px"
      ></el-input>
      <el-button type="primary" :icon="Plus" @click="dialogVisible = true"
        >添加</el-button
      >
      <!-- <el-button type="success" :icon="Edit">编辑</el-button> -->
      <!-- <el-button type="danger" :icon="Delete">删除符合条件的违禁词</el-button> -->
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="违规词操作" width="500">
    <el-form label-width="40px">
      <el-form-item label="名称">
        <el-input v-model="form.word" placeholder="请输入……"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addWord"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  adminAddBadWordsAPI,
  adminDeleteBadWordsAPI,
  adminFindBadWordsAPI,
  adminGetBadWordsAPI,
} from "@/apis/admin";
import type { BadWordList } from "@/types/home";
import { Delete, Edit, Plus, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

const searchText = ref("");
const dialogVisible = ref(false);

const tableData = ref<BadWordList>();
const form = ref({
  word: "",
});

const addWord = async () => {
  const res = await adminAddBadWordsAPI(form.value.word);

  if (res.data.code === 200) {
    ElMessage.success(res.data.message);
    getWords()
  } else ElMessage.error(res.data.message);

  dialogVisible.value = false;
};

const searchBadWord = async () => {
  if (searchText.value.trim() === "") {
    getWords();
    return;
  }

  const res = await adminFindBadWordsAPI(searchText.value);

  if (res.data.code === 200) {
    tableData.value = res.data.data;
  } else ElMessage.error(res.data.message);
};

const deleteBadWordById=async(id:number)=>{
  const res = await adminDeleteBadWordsAPI(id)

  if(res.data.code===200){
    ElMessage.success('删除成功')
    getWords()
  }
  else ElMessage.error(res.data.message)
}

const getWords = async () => {
  const res = await adminGetBadWordsAPI();

  if (res.data.code === 200) {
    tableData.value = res.data.data;
  }
};

onMounted(() => {
  getWords();
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
    flex-wrap: wrap;
  }

  .bottom {
    margin-top: 40px;
    border-top: 1px solid $primary-border-color;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
