import { ElLoading } from "element-plus";

// 定义一个请求次数的变量，用来记录当前页面总共请求的次数
let loadingRequestCount = 0;

let loading: { close: () => void };
function showLoading() {
  if(loadingRequestCount === 0){
    loading = ElLoading.service({
        body: true,
        lock: true,
        text: "加载中……",
        // spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
  }
  loadingRequestCount++
}
function hideLoading() {
    if (loadingRequestCount < 0) return
    loadingRequestCount--
    if (loadingRequestCount === 0) {
        // loadingInstance.close();
        loading.close()
    }
}
export { showLoading, hideLoading };
