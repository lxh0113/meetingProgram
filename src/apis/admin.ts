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

export const adminUpdatePostStatusAPI=(postId:number)=>{
    return http({
        url:"/amdin/forum/status",
        method:"POST",
        params:{
            postId
        }
    })
}