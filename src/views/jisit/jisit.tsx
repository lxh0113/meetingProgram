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
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName:
            meetingStore.meetingSettings?.username || userStore.user!.username,
          email: userStore.user!.email,
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
        }}
        // 在关闭的时候
        onReadyToClose={() => console.log("Jitsi Meet is ready to be closed")}
      />
    </>
  );
}

export default myReactComponent;
