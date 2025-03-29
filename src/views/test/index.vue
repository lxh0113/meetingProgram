<template>
  <div class="recognition-container">
    <button @click="toggleRecognition" :disabled="isConnecting">
      {{ isRecording ? "停止录音" : "开始录音" }}
    </button>

    <div class="status-indicator" :class="status.toLowerCase()">
      {{ statusDisplay }}
    </div>

    <div class="result-display">
      <h3>识别结果：</h3>
      <div class="result-content">{{ result }}</div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";

const useBaiduSpeechRecognition = (config) => {
  const status = ref("CLOSED"); // CLOSED | CONNECTING | OPEN | CLOSING
  const result = ref("");
  const error = ref(null);
  const ws = ref(null);
  const mediaStream = ref(null);
  const audioContext = ref(null);
  const workletNode = ref(null);
  const retryCount = ref(0);
  const MAX_RETRIES = 3;

  // 生成随机ID
  const generateId = () => Math.random().toString(36).substr(2, 8);

  // 注册AudioWorklet
  const registerAudioWorklet = async () => {
    try {
      // 关键路径配置：使用绝对路径确保生产环境能加载
      const workletUrl = new URL("./audio-processor.js", import.meta.url).href;
      await audioContext.value.audioWorklet.addModule(workletUrl);
    } catch (err) {
      console.error("加载AudioWorklet失败:", err);
      throw new Error("音频处理初始化失败");
    }
  };

  // 初始化录音
  const initRecorder = async () => {
    try {
      mediaStream.value = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      audioContext.value = new AudioContext({ sampleRate: 16000 });
      await registerAudioWorklet();

      const source = audioContext.value.createMediaStreamSource(
        mediaStream.value
      );
      workletNode.value = new AudioWorkletNode(
        audioContext.value,
        "audio-processor"
      );

      source.connect(workletNode.value);
      workletNode.value.port.onmessage = (event) => {
        if (
          status.value === "OPEN" &&
          ws.value?.readyState === WebSocket.OPEN
        ) {
          ws.value.send(event.data.data);
        }
      };
    } catch (err) {
      throw new Error(`录音初始化失败: ${err.message}`);
    }
  };

  // 处理WebSocket消息
  const handleMessage = (event) => {
    console.log('处理消息中')
    try {
      const data = JSON.parse(event.data);
      console.log(data)
      switch (data.type) {
        case "MID_TEXT":
          result.value = data.result||"";
          break;
        case "HEARTBEAT":
          break;
        case "ERROR":
          error.value = `识别错误: ${data.message}`;
          stopRecognition();
          break;
      }
    } catch (err) {
      console.error("消息解析错误:", err);
    }
  };

  // 清理资源
  const cleanUp = () => {
    if (
      ws.value &&
      ![WebSocket.CLOSED, WebSocket.CLOSING].includes(ws.value.readyState)
    ) {
      ws.value.close();
    }

    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => track.stop());
    }

    if (audioContext.value && audioContext.value.state !== "closed") {
      audioContext.value.close();
    }

    workletNode.value = null;
    status.value = "CLOSED";
  };

  // 开始识别
  const startRecognition = async () => {
    if (status.value !== "CLOSED" && retryCount.value >= MAX_RETRIES) return;

    try {
      status.value = "CONNECTING";
      error.value = null;

      ws.value = new WebSocket(
        `wss://vop.baidu.com/realtime_asr?sn=${generateId()}`
      );

      ws.value.onopen = async () => {
        try {
          await initRecorder();
          ws.value.send(
            JSON.stringify({
              type: "START",
              data: {
                appid: config.appid,
                appkey: config.appkey,
                dev_pid: 15372,
                cuid: generateId(),
                format: "pcm",
                sample: 16000,
              },
            })
          );
          status.value = "OPEN";
          retryCount.value = 0;
          console.log('WebSocket connected');
        } catch (err) {
          error.value = err.message;
          ws.value.close();
        }
      };

      ws.value.onmessage = handleMessage;
      ws.value.onerror = () => {
        error.value = "连接错误，正在重试...";
        cleanUp();
        retry();
      };
      ws.value.onclose = () => cleanUp();
    } catch (err) {
      error.value = err.message;
      retry();
    }
  };

  // 重试逻辑
  const retry = () => {
    if (retryCount.value < MAX_RETRIES) {
      retryCount.value++;
      setTimeout(startRecognition, 1000 * retryCount.value);
    } else {
      error.value = "超过最大重试次数";
      cleanUp();
    }
  };

  // 停止识别
  const stopRecognition = () => {
    if (status.value === "OPEN") {
      status.value = "CLOSING";
      try {
        if (ws.value?.readyState === WebSocket.OPEN) {
          ws.value.send(JSON.stringify({ type: "END" }));
        }
      } finally {
        cleanUp();
      }
    }
  };

  // 计算属性
  const isRecording = computed(() => status.value === "OPEN");
  const isConnecting = computed(() => status.value === "CONNECTING");
  const statusDisplay = computed(() => {
    switch (status.value) {
      case "CONNECTING":
        return "连接中...";
      case "OPEN":
        return "录音中";
      case "CLOSING":
        return "正在停止";
      default:
        return "准备就绪";
    }
  });

  return {
    status,
    result,
    error,
    isRecording,
    isConnecting,
    statusDisplay,
    startRecognition,
    stopRecognition,
  };
};

// 百度语音配置
const config = {
  appid: 118270267, // 替换为你的百度应用ID
  appkey: "BGXhWKtfsQhycN8SwNw35lhO", // 替换为你的百度应用Key
};

const {
  status,
  result,
  error,
  isRecording,
  isConnecting,
  statusDisplay,
  startRecognition,
  stopRecognition,
} = useBaiduSpeechRecognition(config);

const toggleRecognition = () => {
  isRecording.value ? stopRecognition() : startRecognition();
};

onUnmounted(() => {
  stopRecognition();
});
</script>

<style scoped>
.recognition-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-indicator {
  margin: 10px 0;
  padding: 5px;
  border-radius: 4px;
  text-align: center;

  &.open {
    background-color: #d4edda;
    color: #155724;
  }
  &.connecting {
    background-color: #fff3cd;
    color: #856404;
  }
  &.closing {
    background-color: #f8d7da;
    color: #721c24;
  }
  &.closed {
    background-color: #e2e3e5;
    color: #383d41;
  }
}

.result-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.result-content {
  min-height: 100px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  white-space: pre-wrap;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  padding: 10px;
  background-color: #ffeef0;
  border-radius: 4px;
}
</style>
