import http from "@/utils/http";
import axios from "axios";

export const appKey = "hengnao5oxJTc2JEKIwUaBCmDeZ";

export const appSecret = "suwyw9gz7g8lkv15xf6whpq9o7cd2hxo";

axios.defaults.headers["Access-Control-Allow-Origin"] = "*";

export const getHeaders = async () => {
  return {
    "Access-Control-Allow-Origin": "*",
    appKey: appKey,
    sign: await getSign(),
  };
};

export const agentId = "c22fc725-c9cf-41fc-ae5a-f22b080bd110";

export const summaryAgentId = "29b44e7d-da44-4f74-9c0d-48aedb7888e9";

export const speechAgentId = "2023c262-38c0-432d-9917-8c101839d064";

const getSignAPI = () => {
  // return axios({
  //   url: "http://83.229.122.190:8000/sign",
  //   method: "GET",
  // });
  return http({
    url: "/chat",
    method: "POST",
  });
};

let sign = "1743430700549Zb1seoSSb2orO9C3YjTjpqnY80d7xUb+6KFlt0NI+Ac=";

export async function getSign() {
  // if (sign !== "") return sign;

  // const res = await getSignAPI();

  // if (res.data.code === 200) {
  //   sign = res.data.data;
  // }

  return sign;
}
