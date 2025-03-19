import http from "@/utils/http";

export const adminLoginAPI = (account: string, password: string) => {
  return http({
    url: "/amdin/login",
    method: "GET",
    params: {
      account,
      password,
    },
  });
};

export const adminGetUsersAPI = (account: string, page: number) => {
  return http({
    url: "/amdin/users",
    method: "GET",
    params: {
      account,
      page,
    },
  });
};

export const adminDeleteUsersAPI = (account: string) => {
  return http({
    url: "/amdin/users/delete",
    method: "DELETE",
    params: {
      account,
    },
  });
};

export const adminGetAllPostAPI = (page: number) => {
  return http({
    url: "/amdin/forum",
    method: "GET",
    params: {
      page,
    },
  });
};

export const adminUpdatePostStatusAPI = (postId: number, status: number) => {
  return http({
    url: "/amdin/forum/status",
    method: "POST",
    params: {
      postId,
      status,
    },
  });
};

export const adminAddBadWordsAPI = (word: string) => {
  return http({
    url: "/amdin/sensitive",
    method: "POST",
    params: {
      word,
    },
  });
};

export const adminDeleteBadWordsAPI = (id: number) => {
  return http({
    url: "/amdin/sensitive/delete",
    method: "DELETE",
    params: {
      id,
    },
  });
};

export const adminGetBadWordsAPI = () => {
  return http({
    url: "/amdin/sensitive/getall",
    method: "GET",
  });
};

export const adminFindBadWordsAPI = (word: string) => {
  return http({
    url: "/amdin/sensitive/search",
    method: "GET",
    params: {
      word,
    },
  });
};

export const adminGetMeetingsAPI = (page: number) => {
  return http({
    url: "/amdin/meeting",
    method: "GET",
    params: {
      page,
    },
  });
};

export const adminFindMeetingsAPI = (
  title: string,
  page: number,
  status: number|null
) => {
  return http({
    url: "/amdin/meeting/find",
    method: "GET",
    params: {
      title,
      page,
      status,
    },
  });
};
