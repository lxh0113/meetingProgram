import axios from "axios";
import { appKey, getSign } from "./base";

// 定义 API 基础路径
const API_BASE_URL = "/open/api/v2";

axios.defaults.headers["appKey"] = appKey;
axios.defaults.headers["sign"] = await getSign();
axios.defaults.headers["Access-Control-Allow-Origin"] = "*";

// 文件预处理
export const documentUploadAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/upload`,
    method: "POST", // 根据实际需求调整请求方法
  });
};

// 文件状态查询
export const documentTaskStatusAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/task/status`,
  });
};

// 文件数据删除
export const documentDeleteAPI = (userId: string, id: string) => {
  return axios({
    url: `${API_BASE_URL}/document/delete`,
    method: "POST",
    params: {
      sourceIds: [userId],
      fileIds: [id],
    },
  });
};

// 文件属性更新
export const documentAttributeUpdateAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/attribute_update`,
  });
};

// 内置文件下载
export const documentInternalDownloadAPI = (id: string) => {
  return axios({
    url: `${API_BASE_URL}/document/internal_download`,
    method: "GET",
    params: {
      id,
    },
  });
};

// 文件元数据查询
export const documentMetadataQueryAPI = (sourceId: string) => {
  return axios({
    url: `${API_BASE_URL}/document/metadata_query`,
    method: "POST",
    data: {
      sourceId,
    },
  });
};

// 文件列表查询
export const documentMetadataPageQueryAPI = (
  page: number,
  size: number = 10
) => {
  return axios({
    url: `${API_BASE_URL}/document/metadata_page_query`,
    method: "POST",
    data: {
      page,
      size,
      verbose: 1,
    },
  });
};

// 检索原文
export const documentSearchAPI = (query: string) => {
  return axios({
    url: `${API_BASE_URL}/document/retrieve`,
    method: "POST",
    data: {
      query,
      size: 10,
      owner: "admin",
      labels: [],
      permissions: [],
    },
  });
};

// 检索问答
export const documentChatAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/chat`,
  });
};

// 文档创作
export const documentCreationAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/creation`,
  });
};

// 文档翻译
export const documentTranslateAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/translate`,
  });
};

// 会话停止
export const documentStopAPI = () => {
  return axios({
    url: `${API_BASE_URL}/document/stop`,
  });
};
