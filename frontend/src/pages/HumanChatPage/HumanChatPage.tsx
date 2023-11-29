import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Background from '@components/Background';
import ChatContainer from '@components/ChatContainer';
import Header from '@components/Header';
import SideBar from '@components/SideBar';

import { useSocket } from '@business/hooks/useSocket';
import { useWebRTC } from '@business/hooks/useWebRTC';

export type OutletContext = ReturnType<typeof useWebRTC>;

export default function HumanChatPage() {
  const { connectSocket, disconnectSocket, isSocketConnected } = useSocket('WebRTC');
  const webRTCData = useWebRTC();

  const { roomName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSocketConnected()) {
      connectSocket(import.meta.env.VITE_HUMAN_SOCKET_URL);
    }

    if (!roomName && state?.host) {
      webRTCData.createRoom({
        onSuccess: ({ roomName }) => {
          navigate(roomName, { state: { host: true } });
        },
      });
    }

    return () => {
      webRTCData.endWebRTC();
      disconnectSocket();
    };
  }, []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <SideBar key="chat-side-bar">
            <ChatContainer
              width="w-400"
              height="h-4/5"
              position="top-40"
              // TODO: useHuman~에서 값을 가져와서 넣어주어야 함
              messages={[]}
              inputDisabled={true}
              onSubmitMessage={() => {}}
            />
          </SideBar>,
        ]}
      />
      <Outlet context={webRTCData} />
    </Background>
  );
}
