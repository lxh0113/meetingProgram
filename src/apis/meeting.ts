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

export const deleteMeetingFileAPI = (meetingId: number, uid: string) => {
  return http({
    url: "/meeting/binding/delete",
    method: "DELETE",
    params: {
      meetingId,
      uid,
    },
  });
};

export const meetingRemindAPI = (
  meetingId: number,
  reminderType: number,
  data: FormData
) => {
  return http({
    url: "/meeting/remind",
    method: "POST",
    params: {
      meetingId,
      reminderType,
    },
    data,
  });
};

export const getCalendarAPI = (userId: number) => {
  return http({
    url: "/meeting/calendar",
    method: "GET",
    params: {
      userId,
    },
  });
};

export const bookMeetingAPI = (userId: number, MeetingId: number) => {
  return http({
    url: "/meeting/book",
    method: "POST",
    params: {
      userId,
      MeetingId,
    },
  });
};

export const endMeetingAPI = (meetingId: number) => {
  return http({
    url: "/meeting/end",
    method: "POST",
    params: {
      meetingId,
    },
  });
};

export const joinMeetingAPI = (userId: number, meetingId: number) => {
  return http({
    url: "/meeting/join",
    method: "POST",
    params: {
      userId,
      meetingId,
    },
  });
};

export const signMeetingAPI = (userId: number, meetingId: number) => {
  return http({
    url: "/meeting/sign",
    method: "POST",
    params: {
      userId,
      meetingId,
    },
  });
};

export const getHistoryMeetingAPI = (userId:number) => {
  return http({
    url: "/meeting/history",
    method: "GET",
    params:{
      userId
    }
  });
};
