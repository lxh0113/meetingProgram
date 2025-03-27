import http from "@/utils/http";

export const fileUploadAPI = (data: FormData) => {
  return http({
    url: "/oss/avatar",
    method: "POST",
    data,
  });
};

export const meetingFileUploadAPI = (meetingId: number, data: FormData) => {
  return http({
    url: "/oss/meeting/resource",
    method: "POST",
    params: {
      meetingId,
    },
  });
};
