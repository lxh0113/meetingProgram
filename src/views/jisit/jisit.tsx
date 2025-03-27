import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Button, Modal, message, Upload } from "antd";

import "./jisit.scss";
import { useRoute, useRouter } from "vue-router";

import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { endMeetingAPI } from "@/apis/meeting";
import { ElMessage } from "element-plus";

import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import router from "@/router";
import { baseUrl } from "@/utils/baseUrl";

function MyReactComponent() {
  const userStore = useUserStore();
  const meetingStore = useMeetingStore();
  // const [stream, setStream] = useState<MediaStream>();
  // const [externalApi, setExternalApi] = useState<IJitsiMeetExternalApi>();
  // const audioContextRef = useRef<AudioContext | null>(null); // 用于存储 AudioContext
  // const processorRef = useRef<ScriptProcessorNode | null>(null); // 用于存储 ScriptProcessorNode
  // const wsRef = useRef<WebSocket | null>(null); // 用于存储 WebSocket 实例

  // // 获取麦克风音频流
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true })
  //     .then((stream) => {
  //       console.log("获取到流");
  //       setStream(stream);
  //       console.log(stream.getAudioTracks());
  //     })
  //     .catch((error) => {
  //       if (error.name === "NotAllowedError") {
  //         alert("请允许网站访问麦克风");
  //       } else {
  //         console.error("Error accessing microphone", error);
  //       }
  //     });
  // }, []);

  // // 初始化 AudioContext 和 ScriptProcessorNode
  // useEffect(() => {
  //   if (stream) {
  //     const audioContext = new AudioContext({ sampleRate: 16000 }); // 设置采样率为 16kHz
  //     const source = audioContext.createMediaStreamSource(stream);
  //     const processor = audioContext.createScriptProcessor(4096, 1, 1); // 单声道输入和输出

  //     // 处理音频数据
  //     processor.onaudioprocess = (event) => {
  //       const inputData = event.inputBuffer.getChannelData(0); // 获取单声道数据
  //       const pcmData = convertFloat32ToPCM(inputData); // 转换为 16bit PCM
  //       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
  //         // console.log(pcmData)
  //         wsRef.current.send(pcmData); // 通过 WebSocket 发送 PCM 数据
  //       }
  //     };

  //     source.connect(processor);
  //     processor.connect(audioContext.destination);

  //     audioContextRef.current = audioContext;
  //     processorRef.current = processor;

  //     // 初始化 WebSocket
  //     wsRef.current = new WebSocket("ws://10.251.11.110:8765/"); // 替换为你的 WebSocket 地址
  //     wsRef.current.onopen = () => {
  //       console.log("WebSocket 连接已建立");
  //     };
  //     wsRef.current.onmessage = (event) => {
  //       console.log(event);
  //     };
  //     wsRef.current.onerror = (error) => {
  //       console.error("WebSocket 错误:", error);
  //     };
  //     wsRef.current.onclose = () => {
  //       console.log("WebSocket 连接已关闭");
  //     };

  //     // 清理资源
  //     return () => {
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //       }
  //       if (audioContextRef.current) {
  //         audioContextRef.current.close();
  //       }
  //     };
  //   }
  // }, [stream]);

  // // 将 Float32Array 转换为 16bit PCM
  // const convertFloat32ToPCM = (input: Float32Array): Int16Array => {
  //   const output = new Int16Array(input.length);
  //   for (let i = 0; i < input.length; i++) {
  //     const s = Math.max(-1, Math.min(1, input[i])); // 限制范围在 -1 到 1
  //     output[i] = s < 0 ? s * 0x8000 : s * 0x7fff; // 转换为 16bit
  //   }
  //   return output;
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    closeMeeting();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    closeMeeting();
  };

  const dealRecord = () => {
    // 询问是否要上传录制文件

    showModal();
  };

  const closeMeeting = async () => {
    router.push("/home");

    console.log(meetingStore.meetingSettings?.id);
    const res = await endMeetingAPI(meetingStore.meetingSettings!.id!);

    if (res.data.code === 200) {
    } else ElMessage.error("结束会议失败，请重试");
  };

  
  const props: UploadProps = {
    name: "file",
    action:
      baseUrl +
      "/oss/meeting/recording?meetingId=" +
      meetingStore.meetingSettings!.id!,
    headers: {},
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上传失败.`);
      }
    },
  };

  return (
    <>
      {/* <div>
        <p>实时音频流已启用，正在通过 WebSocket 发送 PCM 数据。</p>
      </div> */}
      <Modal
        title="是否上传本地录制文件"
        open={isModalOpen}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
      </Modal>
      <JitsiMeeting
        domain="www.tccwzfy.cloud"
        roomName={meetingStore.meetingSettings?.id + "" || "您的会议"}
        lang="cn"
        configOverwrite={{
          startWithAudioMuted:
            meetingStore.meetingSettings?.startWithAudioMuted || true,
          startWithVideoMuted:
            meetingStore.meetingSettings?.startWithVideoMuted || true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
          recordings: {
            showRecordingLink: true,
          },
          transcription: {
            enabled: false,
            translationLanguages: ["en", "es", "fr", "ro"],
            useAppLanguage: true,
            preferredLanguage: "en-US",
            autoTranscribeOnRecord: true,
          },
          customParticipantMenuButtons: [
            {
              icon: "data:image/svg+xml;base64,...",
              id: "custom-button",
              text: "Custom Button",
            },
          ],
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          PROVIDER_NAME: "zhihuitong",
          SHOW_JITSI_WATERMARK: "false",
        }}
        userInfo={{
          displayName:
            meetingStore.meetingSettings?.username || userStore.user!.username,
          email: userStore.user!.email,
        }}
        onApiReady={(externalApi) => {
          console.log("Jitsi API is ready", externalApi);
          // setExternalApi(externalApi);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
          iframeRef.style.backgroundColor = "white";
        }}
        onReadyToClose={() => dealRecord()}
      />
    </>
  );
}

export default MyReactComponent;
