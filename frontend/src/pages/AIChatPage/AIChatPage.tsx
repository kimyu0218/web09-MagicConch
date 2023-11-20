import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

import Background from '@components/Background';
import ChatInput from '@components/ChatInput';
import ChatList, { Message } from '@components/ChatList/ChatList';
import CustomButton from '@components/CustomButton';
import Header from '@components/Header';

import {
  sendMessage,
  setMessageEventListener,
  setMessageUpdateEventListener,
  setStreamEndEventListener,
} from '@business/services/socket';

interface AIChatPageProps {}

function AIChatPage({}: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStreaming, setMessageStreaming] = useState(false);

  const addMessage = (type: 'left' | 'right', message: string) => {
    const profile = type == 'left' ? '/moon.png' : '/sponge.png';
    // 임시로 랜덤으로 타로 카드 뽑기
    const tarotId = String(Math.floor(Math.random() * 22)).padStart(2, '0');
    setMessages(messages => [...messages, { type, message, profile, tarotId }]);
  };

  const updateMessage = (message: string) => {
    setMessageStreaming(true);
    setMessages(messages => [...messages.slice(0, -1), { ...messages[messages.length - 1], message }]);
  };

  const onSubmitMessage = (message: string) => {
    addMessage('right', message);
    sendMessage(message);
  };

  useEffect(() => {
    setMessageEventListener(message => addMessage('left', message));
    setMessageUpdateEventListener(message => updateMessage(message));
    setStreamEndEventListener(() => setMessageStreaming(false));
  }, []);

  return (
    <Background type="dynamic">
      <Header
        rightItems={[
          <CustomButton
            color="transparent"
            circle
            key="side-panel-close"
          >
            <Icon
              className="text-25"
              icon="carbon:side-panel-close"
            />
          </CustomButton>,
        ]}
      />

      <div className="w-700 absolute top-95 h-3/4">
        {/* TEST */}
        <ChatList messages={messages} />

        {/* // TODO 서버에서 AI 데이터를 받아오고 있는 동안 disabled 하기 */}
        <ChatInput
          disabled={messageStreaming}
          sendChatMessage={onSubmitMessage}
        />
      </div>
    </Background>
  );
}

export default AIChatPage;
