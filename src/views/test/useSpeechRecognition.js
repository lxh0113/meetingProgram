import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

export function useSpeechRecognition() {
    const status = ref('CLOSED') // 状态：CLOSED | CONNECTING | OPEN | CLOSING
    const result = ref('')
    const error = ref(null)
    const ws = ref(null)
    const mediaRecorder = ref(null)
    const audioChunks = ref([])

    // 配置参数（需要替换为你的实际参数）
    const config = {
        appId: 'f17e53d0',
        apiKey: '42854279ac59dde093cf5ad335be3833',
        wsUrl: 'wss://rtasr.xfyun.cn/v1/ws'
    }

    // 生成签名（优化版）
    const generateSignature = () => {
        const ts = Math.floor(Date.now() / 1000)
        const baseString = config.appId + ts
        console.log('[DEBUG] baseString:', baseString)

        const md5 = CryptoJS.MD5(baseString).toString().toLowerCase()
        console.log('[DEBUG] MD5:', md5)

        const signature = CryptoJS.HmacSHA1(md5, config.apiKey)
        const signa = CryptoJS.enc.Base64.stringify(signature)
        console.log('[DEBUG] Raw signa:', signa)

        return {
            ts,
            signa: encodeURIComponent(signa)
        }
    }

    // 初始化录音
    const initRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const audioContext = new AudioContext({ sampleRate: 16000 })
            const source = audioContext.createMediaStreamSource(stream)

            const processor = audioContext.createScriptProcessor(4096, 1, 1)
            source.connect(processor)
            processor.connect(audioContext.destination)

            processor.onaudioprocess = (e) => {
                if (status.value === 'OPEN') {
                    const audioData = e.inputBuffer.getChannelData(0)
                    const pcmData = convertTo16BitPCM(audioData)
                    ws.value?.send(pcmData)
                }
            }

            return { stream, audioContext }
        } catch (err) {
            error.value = '无法获取麦克风权限'
            throw err
        }
    }

    // 16bit PCM转换
    const convertTo16BitPCM = (input) => {
        const buffer = new ArrayBuffer(input.length * 2)
        const view = new DataView(buffer)
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]))
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
        return view
    }

    // 处理WebSocket消息
    const handleMessage = (message) => {
        try {
            const jsonData = JSON.parse(message.data)
            switch (jsonData.action) {
                case 'started':
                    status.value = 'OPEN'
                    break
                case 'result':
                    const data = JSON.parse(jsonData.data)
                    if (data.cn?.st) {
                        const text = data.cn.st.rt
                            .flatMap(segment => segment.ws)
                            .flatMap(word => word.cw)
                            .map(char => char.w)
                            .join('')
                        result.value += text
                    }
                    break
                case 'error':
                    error.value = `识别错误: ${jsonData.desc} (代码 ${jsonData.code})`
                    stopRecognition()
                    break
            }
        } catch (err) {
            console.error('消息解析错误:', err)
        }
    }

    // WebSocket 连接参数（补充必要参数）
    const getWsParams = () => {
        const { ts, signa } = generateSignature()
        return new URLSearchParams({
            appid: config.appId,
            ts,
            signa,
            lang: 'cn', // 中文
            pd: 'general', // 通用领域
            punc: '0', // 过滤标点
        }).toString()
    }


    // 开始识别
    const startRecognition = async () => {
        try {
            status.value = 'CONNECTING'
            error.value = null
            result.value = ''

            // 生成签名参数
            const { ts, signa } = generateSignature()
            const params = new URLSearchParams({
                appid: config.appId,
                ts,
                signa: encodeURIComponent(signa)
            })

            // 初始化WebSocket
            ws.value = new WebSocket(`${config.wsUrl}?${getWsParams()}`)

            // 初始化录音设备
            const { stream } = await initRecorder()

            // WebSocket事件处理
            ws.value.onopen = () => {
                status.value = 'OPEN'
            }

            ws.value.onmessage = handleMessage

            ws.value.onerror = (err) => {
                error.value = 'WebSocket连接错误'
                stopRecognition()
            }

            ws.value.onclose = () => {
                status.value = 'CLOSED'
            }

            // 自动超时处理
            setTimeout(() => {
                if (status.value === 'CONNECTING') {
                    error.value = '连接超时'
                    stopRecognition()
                }
            }, 5000)

        } catch (err) {
            error.value = err.message
            status.value = 'CLOSED'
        }
    }

    // 停止识别
    const stopRecognition = () => {
        if (status.value === 'OPEN') {
            status.value = 'CLOSING'
            ws.value?.send(JSON.stringify({ end: true }))
            ws.value?.close()
            mediaRecorder.value?.stop()
        }
    }

    // 状态计算属性
    const isRecording = computed(() => status.value === 'OPEN')
    const isLoading = computed(() => status.value === 'CONNECTING')

    return {
        status,
        result,
        error,
        isRecording,
        isLoading,
        startRecognition,
        stopRecognition
    }
}