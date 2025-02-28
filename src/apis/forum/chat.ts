import http from "@/utils/http";

export const createConversationAPI = (
  title: string,
  search_enabled: boolean
) => {
  return http({
    url: "/api/v1/chat/conversations/",
    method: "POST",
    params: {
      title,
      search_enabled,
    },
  });
};

export const getAllConversationsAPI = () => {
  return http({
    url: "/api/v1/chat/conversations/",
    method: "GET",
  });
};

export const getConversationByIdAPI = (conversation_id: number) => {
  return http({
    url: "/api/v1/chat/conversations/" + conversation_id,
    method: "GET",
  });
};

export const sendMessageAPI = (
  conversation_id: number,
  search_enabled: boolean
) => {
  return http({
    url: "/api/v1/chat/conversations/" + conversation_id + "/messages",
    method: "POST",
    params: {
      search_enabled,
    },
  });
};

// 对话历史
export const deleteConversationByIdAPI = (conversation_id: number) => {
  return http({
    url: "/api/v1/history/conversations/" + conversation_id,
    method: "DELETE",
  });
};

export const updateConversationTitleAPI = (
  conversation_id: number,
  title: string
) => {
  return http({
    url: "/api/v1/history/conversations/" + conversation_id,
    method: "PUT",
    params: {
      title,
    },
  });
};

// 联网搜索

export const internetAPI = (query: string) => {
  return http({
    url: "/api/v1/search/web",
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
    url: "/api/v1/search/conversations/" + conversation_id + "/search-setting",
    method: "PUT",
    params: {
      search_enabled,
    },
  });
};
