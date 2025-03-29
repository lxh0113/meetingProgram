// axios基础的封装
import axios from "axios";
import { ElMessage } from "element-plus";
// import router from '@/router/index.js'
// import { useUserStore } from "@/stores/userStore.ts";
import { useRouter } from "vue-router";

import { baseUrl, mockUrl } from "@/utils/baseUrl";

import { showLoading, hideLoading } from "@/utils/loading.ts";
const http = axios.create({
  baseURL:baseUrl,
  // baseURL:'/mock',
  timeout: 6000 * 1000,
});
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;

// 拦截器

// axios请求拦截器

http.interceptors.request.use(
  (config) => {

    let reqUrl = config.url; // 直接获取到当前请求的 URL 地址

    const regex1 = new RegExp("^/rag/query.*$");

    // 如果至少有一个模式匹配，则 isMatched 为 true
    if (
      regex1.test(reqUrl!)
    ) {
      console.log(config.url);
    } else {
      showLoading();
    }

    return config;
  },
  (e) => Promise.reject(e)
);

// axios响应式拦截器
http.interceptors.response.use(
  (response) => {
    // 响应拦截进来隐藏loading效果，此处采用延时处理是合并loading请求效果，避免多次请求loading关闭又开启
    setTimeout(() => {
      hideLoading();
    }, 200);

    const router = useRouter();

    const status = response.status;
    switch (status) {
      case 400:
        ElMessage({ type: "warning", message: response.data.message });
        break;
      case 401:
        router.push("/login");
        break;
      case 402:
        router.push("/login");
        break;
    }

    return response;
  },
  (e) => {
    setTimeout(() => {
      hideLoading();
    }, 200);
    return Promise.reject(e);
  }
);

export default http;
