import http from "@/utils/http";

export const getAllMessageListAPI = (userId: number) => {
  return http({
    url: "/message",
    method: "GET",
    params: {
      userId,
    },
  });
};

export const getMessagesAPI = (userId: number, pageNum: number) => {
  return http({
    url: "/message/getmsg",
    method: "GET",
    params: {
      userId,
      pageNum,
    },
  });
};

export const addToDoAPI = (
  userId: number,
  messageId: number,
  createTime: string,
  title: string,
  content: string
) => {
  return http({
    url: "/message/addtodo",
    method: "POST",
    data: {
      userId,
      messageId,
      createTime,
      title,
      content,
    },
  });
};

export const getMessageInfoAPI = (messageId: number) => {
  return http({
    url: "/message/info/" + messageId,
    method: "GET",
  });
};

export const getMessageToDoInfoAPI = (messageToDoId: number) => {
  return http({
    url: "/message/todo/" + messageToDoId,
    method: "GET",
  });
};

export const getToDosByYearMonthAPI = () => {
  return http({
    url: "/message/todos",
    method: "GET",
  });
};
