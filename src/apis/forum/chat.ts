import http from "@/utils/http";

// 提取公共前缀
const API_BASE = "/form";

export const createConversationAPI = (title: string, user_id: string) => {
  return http({
    url: API_BASE + "/chat/conversations/",
    method: "POST",
    params: {
      title,
      user_id,
    },
  });
};

export const getAllConversationsAPI = (user_id: string) => {
  return http({
    url: API_BASE + "/chat/conversations/",
    method: "GET",
    params: {
      user_id,
    },
  });
};

export const getConversationByIdAPI = (
  conversation_id: number,
  user_id: string
) => {
  return http({
    url: API_BASE + "/chat/conversations/" + conversation_id,
    method: "GET",
    params: {
      user_id,
    },
  });
};

export const sendMessageAPI = (
  conversation_id: number,
  user_id: string
) => {
  return http({
    url: API_BASE + "/chat/conversations/" + conversation_id + "/messages",
    method: "POST",
    params: {
      user_id,
    },
  });
};

// 对话历史
export const deleteConversationByIdAPI = (conversation_id: number,user_id:string) => {
  return http({
    url: API_BASE + "/history/conversations/" + conversation_id,
    method: "DELETE",
    params:{
      user_id
    }
  });
};

export const updateConversationTitleAPI = (
  conversation_id: number,
  title: string,
  user_id:string
) => {
  return http({
    url: API_BASE + "/history/conversations/" + conversation_id,
    method: "PUT",
    params: {
      title,
      user_id
    },
  });
};

// 联网搜索
export const internetAPI = (query: string) => {
  return http({
    url: API_BASE + "/search/web",
    method: "GET",
    params: {
      query,
    },
  });
};

export const updateSearchInternetAPI = (
  conversation_id: number,
  search_enabled: boolean
) => {
  return http({
    url:
      API_BASE + "/search/conversations/" + conversation_id + "/search-setting",
    method: "PUT",
    params: {
      search_enabled,
    },
  });
};
