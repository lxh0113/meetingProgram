import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

import "./jisit.scss";

import { useUserStore } from "@/stores/userStore";
import { useMeetingStore } from "@/stores/meetingStore";

function myReactComponent() {
  const userStore = useUserStore();

  const meetingStore = useMeetingStore();

  return (
    <>
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
          // 字幕功能
          transcription: {
            enabled: true, // 是否启用字幕
            translationLanguages: ["en", "es", "fr", "ro"], // 翻译语言
            useAppLanguage: true, // 使用应用语言
            preferredLanguage: "en-US", // 默认语言
            autoTranscribeOnRecord: true, // 录制时自动开启字幕
          },
           customParticipantMenuButtons: [
            {
                icon: 'data:image/svg+xml;base64,...',
                id: 'custom-button',
                text: 'Custom Button'
            }
        ]
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          PROVIDER_NAME: "zhihuitong",
          // 是否显示 Jitsi 水印
          SHOW_JITSI_WATERMARK: "false",
        }}
        userInfo={{
          displayName:
            meetingStore.meetingSettings?.username || userStore.user!.username,
          email: userStore.user!.email,
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
          console.log("Jitsi API is ready", externalApi);


          // 示例：在会议开始后动态启用音频
          externalApi.executeCommand("toggleAudio");

          // 监听音视频流状态变化
          externalApi.on("trackMute", (track) => {
            console.log("Track muted:", track);
          });

          externalApi.on("trackUnmute", (track) => {
            console.log("Track unmuted:", track);
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
          iframeRef.style.backgroundColor = "white";
        }}
        // 在关闭的时候
        onReadyToClose={() => console.log("Jitsi Meet is ready to be closed")}
      />
    </>
  );
}

export default myReactComponent;
