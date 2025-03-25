import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ElMessage } from "element-plus";

// 定义消息回调类型
type MessageHandler = (data: any) => void;

export class SSEService {
  async connect(
    url: string,
    method: "GET" | "POST",
    body: object,
    onMessageHandler: MessageHandler,
    myHeader?: Record<string, string> // 键值对的形式
  ) {
    return await fetchEventSource(url, {
      method: method,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...myHeader, // 当 myHeader 未定义时会自动忽略展开
      },
      body: JSON.stringify(body),
      openWhenHidden: true,
      async onopen() {
        // 可以在这里添加连接成功逻辑
      },
      onmessage(event) {
        onMessageHandler(event);
      },
      onerror(error) {
        ElMessage.error("SSE连接出错: " + error);
      },
      onclose(){

      }
    });
  }
}


