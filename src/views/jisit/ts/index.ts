import { ref, computed, onUnmounted, Ref } from 'vue';

interface BaiduSpeechConfig {
    appid: string | number;
    appkey: string;
}

interface BaiduSpeechResult {
    status: Ref<string>;
    result: Ref<string>;
    error: Ref<string | null>;
    isRecording: Ref<boolean>;
    isConnecting: Ref<boolean>;
    statusDisplay: Ref<string>;
    startRecognition: () => Promise<void>;
    stopRecognition: () => void;
}

const useBaiduSpeechRecognition = (config: BaiduSpeechConfig): BaiduSpeechResult => {
    const status = ref < "CLOSED" | "CONNECTING" | "OPEN" | "CLOSING" > ("CLOSED");
    const result = ref < string > ("");
    const error = ref < string | null > (null);
    const ws = ref < WebSocket | null > (null);
    const mediaStream = ref < MediaStream | null > (null);
    const audioContext = ref < AudioContext | null > (null);
    const workletNode = ref < AudioWorkletNode | null > (null);
    const retryCount = ref < number > (0);
    const MAX_RETRIES = 3;

    // 生成随机ID
    const generateId = (): string => Math.random().toString(36).substr(2, 8);

    // 注册AudioWorklet
    const registerAudioWorklet = async (): Promise<void> => {
        try {
            // 关键路径配置：使用绝对路径确保生产环境能加载
            const workletUrl = new URL("./audio-processor.js", import.meta.url).href;
            await audioContext.value!.audioWorklet.addModule(workletUrl);
        } catch (err) {
            console.error("加载AudioWorklet失败:", err);
            throw new Error("音频处理初始化失败");
        }
    };

    // 初始化录音
    const initRecorder = async (): Promise<void> => {
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
            workletNode.value.port.onmessage = (event: MessageEvent) => {
                if (
                    status.value === "OPEN" &&
                    ws.value?.readyState === WebSocket.OPEN
                ) {
                    ws.value.send(event.data.data);
                }
            };
        } catch (err) {
            throw new Error(`录音初始化失败: ${(err as Error).message}`);
        }
    };

    // 处理WebSocket消息
    const handleMessage = (event: MessageEvent): void => {
        console.log('处理消息中');
        try {
            const data = JSON.parse(event.data);
            console.log(data);
            switch (data.type) {
                case "MID_TEXT":
                    result.value = data.result || "";
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
    const cleanUp = (): void => {
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
    const startRecognition = async (): Promise<void> => {
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
                    ws.value!.send(
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
                    error.value = (err as Error).message;
                    ws.value!.close();
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
            error.value = (err as Error).message;
            retry();
        }
    };

    // 重试逻辑
    const retry = (): void => {
        if (retryCount.value < MAX_RETRIES) {
            retryCount.value++;
            setTimeout(startRecognition, 1000 * retryCount.value);
        } else {
            error.value = "超过最大重试次数";
            cleanUp();
        }
    };

    // 停止识别
    const stopRecognition = (): void => {
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
    const isRecording = computed < boolean > (() => status.value === "OPEN");
    const isConnecting = computed < boolean > (() => status.value === "CONNECTING");
    const statusDisplay = computed < string > (() => {
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
const config: BaiduSpeechConfig = {
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

const toggleRecognition = (): void => {
    isRecording.value ? stopRecognition() : startRecognition();
};

onUnmounted(() => {
    stopRecognition();
});

export {
    useBaiduSpeechRecognition,
    status,
    result,
    error,
    isRecording,
    isConnecting,
    statusDisplay,
    startRecognition,
    stopRecognition,
    toggleRecognition
};