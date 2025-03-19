import http from "@/utils/http";

export const appKey = "hengnao5oxJTc2JEKIwUaBCmDeZ";

export const appSecret = "suwyw9gz7g8lkv15xf6whpq9o7cd2hxo";

// export const baseUrl='https://www.das-ai.com'

// export const pluginsUrl='https://www.das-ai.com/dasChat'

export const agentId="c22fc725-c9cf-41fc-ae5a-f22b080bd110"

const getSignAPI = () => {
  return http({
    url: "/chat",
    method: "POST",
  });
};

let sign = "";

export async function getSign() {
  
  // if (sign !== "") return sign;

  // const res = await getSignAPI();

  // if (res.data.code === 200) {
  //   sign = res.data.data;
  // }

  return sign;
}
