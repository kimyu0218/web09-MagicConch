import { CreateChattingMessageDto } from 'src/chat/dto';
import { ChattingMessage, ChattingRoom } from 'src/chat/entities';
import { ChatLog } from 'src/common/types/chatbot';
import { roomMock } from './chatting-room';

function makeMessageMock(
  messageId: string,
  chatLog: ChatLog,
  roomMock: ChattingRoom,
): ChattingMessage {
  const messageMock: ChattingMessage = new ChattingMessage();
  messageMock.id = messageId;
  messageMock.isHost = chatLog.isHost;
  messageMock.message = chatLog.message;
  messageMock.room = roomMock;
  return messageMock;
}

const messageId: string = '12345678-1234-5678-1234-567812345678';

const chatLog: ChatLog = {
  isHost: false,
  message: 'message',
};

export const messageMock: ChattingMessage = makeMessageMock(
  messageId,
  chatLog,
  roomMock,
);

export const messageMocks: ChattingMessage[] = [messageMock];

export const createMessageDtoMock: CreateChattingMessageDto =
  CreateChattingMessageDto.fromChatLog(roomMock.id, chatLog);