export const baseUrl = "http://localhost:8079";

export const mockUrl = "http://localhost:8079/mock";

export const ragUploadUrl='http://10.251.39.158:8000/upload'

export const getForumAIUrl = (id: number) => {
  return baseUrl + `/api/v1/chat/conversations/${id}/messages`;
};
