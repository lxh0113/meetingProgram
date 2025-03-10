import http from "../utils/http";

import type { PublishPost, ReplyComment } from "@/types/home";

export const getPostsAPI = () => {
  return http({
    url: "/forum",
  });
};

export const getPostByIdAPI = (id: number, page: number) => {
  return http({
    url: "/forum/" + id,
    method: "GET",
    params: {
      page,
    },
  });
};

export const addPostAPI = (userId: number, data: PublishPost) => {
  return http({
    url: "/forum/publish",
    method: "POST",
    params: {
      userId,
    },
    data,
  });
};

export const deletePostAPI = (postId: number, userId: number) => {
  return http({
    url: "/forum/delete",
    method: "DELETE",
    params: {
      postId,
      userId,
    },
  });
};

export const updatePostAPI = (postId: number, data: PublishPost) => {
  return http({
    url: "/forum/update",
    method: "PUT",
    params: {
      postId,
    },
    data,
  });
};

export const commentPostAPI = (postId: number, data: ReplyComment) => {
  return http({
    url: "/forum/" + postId + "/comment",
    method: "POST",
    data,
  });
};

export const commentByCommentIdAPI = (
  postId: number,
  commentId: number,
  data: ReplyComment
) => {
  return http({
    url: "/forum/" + postId + "/" + commentId + "/comment",
    method: "POST",
    data,
  });
};

export const replyCommentAPI = (
  postId: number,
  commentId: number,
  page: number
) => {
  return http({
    url: "/forum/" + postId + "/" + commentId,
    method: "POST",
    params: {
      page,
    },
  });
};

export const likePostAPI = (postId: number, userId: number) => {
  return http({
    url: "/forum/" + postId + "/like",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const favoritePostAPI = (postId: number, userId: number) => {
  return http({
    url: "/forum/" + postId + "/favorite",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const getActionsAPI = (postId: number, userId: number) => {
  return http({
    url: "/forum/" + postId + "/actions",
    method: "GET",
    params: {
      userId,
    },
  });
};

export const likeCommentAPI = (
  postId: number,
  commentId: number,
  userId: number
) => {
  return http({
    url: "/forum/" + postId + "/" + commentId + "/like",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const favoriteCommentAPI = (
  postId: number,
  commentId: number,
  userId: number
) => {
  return http({
    url: "/forum/" + postId + "/" + commentId + "/favorite",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const attentionPostAPI = (postId: number, userId: number) => {
  return http({
    url: "/forum/" + postId + "/attention",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const getRankingAPI = () => {
  return http({
    url: "/forum/ranking",
    method: "GET",
  });
};

export const searchForumAPI = (content: string, currentPage: number) => {
  return http({
    url: "/forum/find",
    method: "GET",
    params: {
      content,
      currentPage,
    },
  });
};
