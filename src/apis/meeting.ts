import type { MeetingSetting } from "@/types/home";
import http from "@/utils/http";

export const getAllAPI = (meetingId: number) => {
  return http({
    url: "/meeting/meetingId/file",
    method: "GET",
    params: {
      meetingId,
    },
  });
};

export const uploadMeetingFileAPI = (url: string, meetingId: number) => {
  return http({
    url: "/meeting/meetingId/recording",
    method: "POST",
    params: {
      url,
      meetingId,
    },
  });
};

export const getMeetingRecordUrlAPI = (meetingId: number) => {
  return http({
    url: "/meeting/meetingId/getrecording",
    method: "GET",
    params: {
      meetingId,
    },
  });
};

export const createMeetingAPI = (data: MeetingSetting) => {
  return http({
    url: "/meeting/create",
    method: "POST",
    data,
  });
};

export const quicklyMeetingAPI = (userId: number) => {
  return http({
    url: "/meeting/quickly",
    method: "POST",
    params: {
      userId,
    },
  });
};

export const bindMeetingFileAPI = (meetingId: number, uid: string) => {
  return http({
    url: "/meeting/binding",
    method: "POST",
    params: {
      meetingId,
      uid,
    },
  });
};

export const deleteMeetingFileAPI=(meetingId:number,uid:string)=>{
    return http({
        url:"/meeting/binding/delete",
        method:"DELETE",
        params:{
            meetingId,uid
        }
    })
}
