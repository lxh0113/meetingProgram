import http from "@/utils/http";
// import axios from "axios";

export const appKey = "hengnao5oxJTc2JEKIwUaBCmDeZ";

export const appSecret = "suwyw9gz7g8lkv15xf6whpq9o7cd2hxo";

// axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
// axios.defaults.withCredentials = true;

export const getHeaders = async () => {
  return {
    "Access-Control-Allow-Origin": "*",
    appKey: appKey,
    sign: await getSign(),
  };
};

export const agentId = "5575a296-d0af-4f7a-8ad8-2131830fb97c";

export const summaryAgentId = "29b44e7d-da44-4f74-9c0d-48aedb7888e9";

export const speechAgentId = "2023c262-38c0-432d-9917-8c101839d064";

const getSignAPI = () => {
  return http({
    url: "/form/sign",
    method: "GET",
  });
  // return http({
  //   url: "/chat",
  //   method: "POST",
  // });
};

let sign = "";
export async function getSign() {
  if (sign !== "") return sign;

  const res = await getSignAPI();

  if (res.data.code === 200) {
    sign = res.data.data.sign;
  }

  return sign;
}
