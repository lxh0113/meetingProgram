import { ref, onUnmounted } from "vue";

interface AudioRecognitionOptions {
  sampleRate?: number;
  frameDuration?: number; // 毫秒
  onTranscription?: (text: string) => void;
  onError?: (error: Error) => void;
}

export function useAudioRecognition(options: AudioRecognitionOptions = {}) {
  const {
    sampleRate = 16000,
    frameDuration = 160, // 160ms 最佳
    onTranscription,
    onError,
  } = options;

  const isRecording = ref(false);
  const transcript = ref("");
  const error = ref<Error | null>(null);

  // 计算每帧的字节数
  const bytesPerFrame = Math.floor((sampleRate * 2 * frameDuration) / 1000);

  let audioContext: AudioContext | null = null;
  let processor: ScriptProcessorNode | null = null;
  let mediaStream: MediaStream | null = null;
  let ws: WebSocket | null = null;
  let buffer: Int16Array | null = null;
  let bufferOffset = 0;
  let lastSendTime = 0;
  let heartbeatInterval: number | null = null;

  // 初始化 WebSocket
  const initWebSocket = (url: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket connected");
        // 开始发送心跳包防止断开
        heartbeatInterval = window.setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "HEARTBEAT" }));
          }
        }, 3000); // 3秒一次心跳
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(new Error("WebSocket connection failed"));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "TRANSCRIPTION" && data.text) {
            transcript.value = data.text;
            onTranscription?.(data.text);
          } else if (data.type === "ERROR") {
            const err = new Error(data.message || "Unknown error");
            error.value = err;
            onError?.(err);
            stopRecording();
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };
    });
  };

  // 处理音频数据
  const processAudio = (inputBuffer: Float32Array) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    // 转换为16位PCM
    const pcmData = new Int16Array(inputBuffer.length);
    for (let i = 0; i < inputBuffer.length; i++) {
      const s = Math.max(-1, Math.min(1, inputBuffer[i]));
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    // 如果缓冲区不存在或已满，发送当前帧
    if (!buffer || bufferOffset + pcmData.length > buffer.length) {
      if (buffer && bufferOffset > 0) {
        sendAudioFrame(buffer.slice(0, bufferOffset));
      }
      buffer = new Int16Array(bytesPerFrame);
      bufferOffset = 0;
    }

    // 将数据添加到缓冲区
    buffer.set(pcmData, bufferOffset);
    bufferOffset += pcmData.length;

    // 如果缓冲区已满，立即发送
    if (bufferOffset === buffer.length) {
      sendAudioFrame(buffer);
      buffer = null;
      bufferOffset = 0;
    }
  };

  // 发送音频帧
  const sendAudioFrame = (frameData: Int16Array) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    try {
      // 确保不超过5秒间隔
      const now = Date.now();
      if (now - lastSendTime > 4500) {
        // 4.5秒内必须发送一次
        ws.send(JSON.stringify({ type: "KEEPALIVE" }));
      }
      lastSendTime = now;

      // 发送二进制音频帧
      ws.send(frameData.buffer);
    } catch (err) {
      console.error("Failed to send audio frame:", err);
      error.value = err as Error;
      onError?.(err as Error);
    }
  };

  // 开始录音
  const startRecording = async (wsUrl: string) => {
    if (isRecording.value) return;

    try {
      // 初始化 WebSocket 连接
      await initWebSocket(wsUrl);

      // 获取麦克风权限
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // 创建音频上下文
      audioContext = new AudioContext({ sampleRate });
      const source = audioContext.createMediaStreamSource(mediaStream);

      // 创建音频处理器
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        processAudio(e.inputBuffer.getChannelData(0));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      isRecording.value = true;
      transcript.value = "";
      error.value = null;
      lastSendTime = Date.now();
    } catch (err) {
      console.error("Failed to start recording:", err);
      error.value = err as Error;
      onError?.(err as Error);
      stopRecording();
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (!isRecording.value) return;

    // 发送缓冲区中剩余的数据
    if (buffer && bufferOffset > 0) {
      sendAudioFrame(buffer.slice(0, bufferOffset));
    }

    // 关闭音频处理
    if (processor) {
      processor.disconnect();
      processor = null;
    }

    if (audioContext) {
      audioContext.close().catch(console.error);
      audioContext = null;
    }

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }

    // 关闭 WebSocket
    if (ws) {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }

      // 发送结束标记
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "END" }));
      }

      // 延迟关闭以确保结束标记发送成功
      setTimeout(() => {
        if (ws) {
          ws.close();
          ws = null;
        }
      }, 500);
    }

    isRecording.value = false;
    buffer = null;
    bufferOffset = 0;
  };

  // 组件卸载时自动清理
  onUnmounted(() => {
    stopRecording();
  });

  return {
    isRecording,
    transcript,
    error,
    startRecording,
    stopRecording,
  };
}
