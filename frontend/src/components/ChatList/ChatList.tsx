import MessageBox from '../MessageBox';
import { useEffect, useRef } from 'react';

export interface Message {
  type: 'left' | 'right';
  message: string;
  profile: string;
  tarotId?: string;
}

interface ChatListProps {
  size?: string;
  messages: Message[];
}

// TODO: tarotId 올바르게 교체
function ChatList({ messages }: ChatListProps) {
  const messagesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    messagesRef.current!.scrollTop = messagesRef.current!.scrollHeight;
  }, [messages]);

  return (
    <ul
      ref={messagesRef}
      className={`w-full h-full mb-20 overflow-auto scroll-smooth`}
    >
      {messages.map(({ type, message, profile, tarotId }, index) => {
        return (
          <li
            key={`${type}-${message}`}
            className={`flex pr-20 ${index != 0 && 'mt-40'} ${type == 'right' && 'justify-end'}`}
          >
            <MessageBox
              tarotId={index == 0 ? undefined : tarotId}
              type={type}
              message={message}
              profile={profile}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ChatList;
