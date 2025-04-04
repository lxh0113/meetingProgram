import type { GenerateSpeech, Guide } from "@/types/home";
import http from "@/utils/http";

const baseUrl = "/aiMeeting";

export const generateSpeechAPI = (data: GenerateSpeech) => {
  return http({
    url: `${baseUrl}/speech`,
    method: "POST",
    data,
  });
};

export const getConclusionAPI = (input: string) => {
  return http({
    url: `${baseUrl}/conclusion`,
    method: "POST",
    data: {
      input,
    },
  });
};

export const getMeetingInConclusionAPI = (input: string) => {
  return http({
    url: `${baseUrl}/in-meeting`,
    method: "POST",
    data: {
      input,
    },
  });
};

export const getGuideAPI = (data: Guide) => {
  return http({
    url: `${baseUrl}/offline-guide`,
    method: "POST",
    data,
  });
};
