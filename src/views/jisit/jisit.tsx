import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

import "./jisit.scss"

function myReactComponent() {
  return (
    <div className="myJisit">
      <JitsiMeeting
        domain="www.tccwzfy.cloud"
        roomName="PleaseUseAGoodRoomName"
        lang="cn"
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: "lxh",
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100vh";
        }}
      />
    </div>
  );
}

export default myReactComponent;
