export const baseUrl = "http://localhost:8079";

export const mockUrl = "http://localhost:8079/mock";

export const getForumAIUrl = (id: number) => {
  return baseUrl + `/api/v1/chat/conversations/${id}/messages`;
};
