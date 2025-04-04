import http from "@/utils/http";

const baseUrl = "/rag";

// RAG上传文档
export const uploadFileAPI = (data: FormData) => {
  return http({
    url: `${baseUrl}/upload`, // 添加baseUrl前缀
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    data,
  });
};

// 是否开启检索
export const processTaskAPI = (task_id: string) => {
  return http({
    url: `${baseUrl}/process/${task_id}`, // 添加baseUrl前缀
    method: "POST",
  });
};

// 获取检索状态
export const getTaskStatusAPI = (task_id: string) => {
  return http({
    url: `${baseUrl}/task/${task_id}`, // 添加baseUrl前缀
    method: "GET",
  });
};

// 询问
export const queryDocAPI = (query: string) => {
  return http({
    url: `${baseUrl}/query`, // 添加baseUrl前缀
    method: "POST",
    data: {
      query,
      filters: {},
    },
  });
};

// 检查是否健康
export const isHealthAPI = () => {
  return http({
    url: `${baseUrl}/health`, // 添加baseUrl前缀
    method: "GET",
  });
};

