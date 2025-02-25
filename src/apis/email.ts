import http from "@/utils/http";

export const sendVerificationCodeAPI = (email: string) => {
  return http({
    url: "/email/register",
    method: "POST",
    params: {
      email,
    },
  });
};