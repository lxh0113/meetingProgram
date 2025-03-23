import axios from "axios";

import { appKey, getSign, agentId } from "./base";
import { v4 as uuidv4 } from "uuid";

axios.defaults.headers["appKey"] = appKey;
axios.defaults.headers["sign"] = await getSign();
axios.defaults.headers["Access-Control-Allow-Origin"] = "*";

const PRE_URL = "https://www.das-ai.com";

// 定义 API 基础路径
const API_BASE_URL = "/open/api/v2";

export const getAiBaseURL = () => {
  return PRE_URL + API_BASE_URL;
};

// 智能体执行
export const agentExecuteAPI = (input?: string) => {
  return axios({
    url: `${API_BASE_URL}/agent/execute`,
    method: "POST",
    data: {
      sid: uuidv4(),
      id: agentId,
      input,
      stream: false,
    },
  });
};

// 智能体停止
export const agentStopAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/execute/stop`,
  });
};

// 智能体查询
export const agentSearchAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/search`,
  });
};

// 文件上传
export const fileUploadAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/file/upload`,
  });
};

// 文件下载
export const fileDownloadAPI = (fileId: string) => {
  return axios({
    url: `${API_BASE_URL}/agent/file/download`,
    method: "POST",
    data: {
      fileId,
    },
  });
};

// 智能体执行统计接口
export const agentStatisticsAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/statistics`,
  });
};

// 异步任务提交
export const taskSubmitAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/task/submit`,
  });
};

// 异步任务取消
export const taskStopAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/task/stop`,
  });
};

// 异步任务状态查询
export const taskStatusAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/task/status`,
  });
};

// 异步任务执行结果查询
export const taskMessagesAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/task/messages`,
  });
};

// 智能体交互回答
export const agentResumeAPI = (messageId: string, input: string) => {
  return axios({
    url: `${API_BASE_URL}/agent/execute/resume`,
    method: "POST",
    data: {
      messageId,
      input,
      principle: "user",
    },
  });
};

// 智能体测试集查询
export const agentTestCasesAPI = () => {
  return axios({
    url: `${API_BASE_URL}/agent/testCases`,
  });
};
