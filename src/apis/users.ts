import type { RegisterData, UpdateUser, User } from "@/types/home";
import http from "../utils/http";

export const loginAPI = (account: string, password: string) => {
  return http({
    url: "/users/login",
    params: {
      account,
      password,
    },
  });
};

export const getUserInfoAPI = (account: string) => {
  return http({
    url: "/users/info",
    params: {
      account,
    },
  });
};

export const updateAPI = (emailCaptcha: string | null, data: UpdateUser) => {
  return http({
    url: "/users/update",
    method: "PUT",
    params: {
      emailCaptcha,
    },
    data,
  });
};

export const registerAPI = (data: RegisterData) => {
  return http({
    url: "/users/register",
    method: "POST",
    data,
  });
};

export const updatePasswordAPI = (
  account: string,
  Password: string,
  email: string,
  emailCaptcha: string
) => {
  return http({
    url: "/users/password",
    method: "POST",
    data: {
      account,
      Password,
      email,
      emailCaptcha,
    },
  });
};

export const getPostAPI = (userId: number, page: number) => {
  return http({
    url: "/users/post",
    method: "GET",
    params: {
      userId,
      page,
    },
  });
};

export const getLikeAPI = (userId: number, page: number) => {
  return http({
    url: "/users/like",
    method: "GET",
    params: {
      userId,
      page,
    },
  });
};

export const getFavorateAPI = (userId: number, page: number) => {
  return http({
    url: "/users/favorite",
    method: "GET",
    params: {
      userId,
      page,
    },
  });
};

export const getUserFollowAPI = (userId: number, page: number) => {
  return http({
    url: "/users/attention",
    method: "GET",
    params: {
      userId,
      page,
    },
  });
};


