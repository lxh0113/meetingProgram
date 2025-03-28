import http from "@/utils/http";

export const getKnowledgeByUrlAPI = (videoUrl: string) => {
  return http({
    url: "/api/uploadVideo",
    method: "POST",
    params: {
      videoUrl,
    },
  });
};

export const getSummaryByVideoAPI = (videoUrl: string) => {
  return http({
    url: "/api/summary",
    method: "POST",
    params: {
      videoUrl,
    },
  });
};
