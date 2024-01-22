import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from 'src/members/entities';
import {
  createMessageDtoMock,
  messageMock,
  messageMocks,
  roomId,
  roomMock,
  roomMocks,
  updateRoomDtoMock,
  wrongRoomId,
} from 'src/mocks/chat';
import { diffMemberId, memberId, memberMock } from 'src/mocks/members';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { ChattingMessageDto, ChattingRoomDto } from './dto';
import { ChattingMessage, ChattingRoom } from './entities';

describe('ChatService', () => {
  let service: ChatService;
  let chattingRoomRepository: Repository<ChattingRoom>;
  let chattingMessageRepository: Repository<ChattingMessage>;
  let membersRepository: Repository<Member>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChattingRoom),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ChattingMessage),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
      ],
    }).compile();

    service = moduleRef.get<ChatService>(ChatService);
    chattingRoomRepository = moduleRef.get<Repository<ChattingRoom>>(
      getRepositoryToken(ChattingRoom),
    );
    chattingMessageRepository = moduleRef.get<Repository<ChattingMessage>>(
      getRepositoryToken(ChattingMessage),
    );
    membersRepository = moduleRef.get<Repository<Member>>(
      getRepositoryToken(Member),
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRoom', () => {
    it('채팅방을 생성한다', async () => {
      const saveMemberMock = jest
        .spyOn(membersRepository, 'save')
        .mockResolvedValueOnce(memberMock);

      const saveMock = jest
        .spyOn(chattingRoomRepository, 'save')
        .mockResolvedValueOnce(roomMock);

      await expect(service.createRoom(memberId)).resolves.not.toThrow();
      expect(saveMemberMock).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalledWith({ participant: memberMock });
    });

    /**
     * TODO : 추후 위의 내용 삭제하고 아래 내용 작성
     */
    // it('채팅방을 생성한다 (로그인 하지 않은 사용자)', async () => {});
    // it('채팅방을 생성한다 (로그인한 사용자)', async () => {});
  });

  describe('createMessage', () => {
    it('해당 PK의 채팅방에 채팅 메시지를 생성한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const saveMock = jest
        .spyOn(chattingMessageRepository, 'save')
        .mockResolvedValueOnce(messageMock);

      await expect(
        service.createMessages(roomId, [createMessageDtoMock]),
      ).resolves.not.toThrow();
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
      expect(saveMock).toHaveBeenCalledWith({
        room: expect.any(ChattingRoom),
        isHost: createMessageDtoMock.isHost,
        message: createMessageDtoMock.message,
      });
    });

    it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(service.createMessages(wrongRoomId, [])).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneByMock).toHaveBeenCalledWith({ id: wrongRoomId });
    });
  });

  describe('findRoomsById', () => {
    it('해당 PK의 채팅방을 조회한다', async () => {
      const findByMock = jest
        .spyOn(chattingRoomRepository, 'findBy')
        .mockResolvedValueOnce(roomMocks);

      const expectation: ChattingRoomDto[] =
        await service.findRoomsById(roomId);
      expect(expectation).toEqual(
        roomMocks.map((room) =>
          expect.objectContaining({ id: room.id, title: room.title }),
        ),
      );
      expect(findByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('findMessagesById', () => {
    it('해당 PK의 채팅방에 오고 간 채팅 메시지를 조회한다', async () => {
      const findByMock = jest
        .spyOn(chattingMessageRepository, 'findBy')
        .mockResolvedValueOnce(messageMocks);

      const expectation: ChattingMessageDto[] =
        await service.findMessagesById(roomId);
      expect(expectation).toEqual(
        messageMocks.map((message) =>
          expect.objectContaining({
            id: message.id,
            isHost: message.isHost,
            message: message.message,
          }),
        ),
      );
      expect(findByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('updateRoom', () => {
    it('해당 PK의 채팅방 제목을 수정한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const updateMock = jest.spyOn(chattingRoomRepository, 'update');
      updateMock.mockResolvedValueOnce({ affected: 1 } as any);

      await expect(
        service.updateRoom(roomId, memberId, updateRoomDtoMock),
      ).resolves.not.toThrow();
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
      expect(updateMock).toHaveBeenCalledWith(
        { id: roomId },
        { title: updateRoomDtoMock.title },
      );
    });

    it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(
        service.updateRoom(roomId, memberId, updateRoomDtoMock),
      ).rejects.toThrow(NotFoundException);
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('해당 PK의 채팅방을 수정할 수 있는 권한이 없어 ForbiddenException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      await expect(
        service.updateRoom(roomId, diffMemberId, updateRoomDtoMock),
      ).rejects.toThrow(ForbiddenException);
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });

  describe('removeRoom', () => {
    it('해당 PK의 채팅방을 삭제한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      const softDeleteMock = jest.spyOn(chattingRoomRepository, 'softDelete');
      softDeleteMock.mockResolvedValueOnce({ affected: 1 } as any);

      await expect(service.removeRoom(roomId, memberId)).resolves.not.toThrow();
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
      expect(softDeleteMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('해당 PK의 채팅방이 존재하지 않아 NotFoundException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(null);

      await expect(service.removeRoom(roomId, memberId)).rejects.toThrow(
        NotFoundException,
      );
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });

    it('해당 PK의 채팅방을 삭제할 수 있는 권한이 없어 ForbiddenException을 반환한다', async () => {
      const findOneByMock = jest
        .spyOn(chattingRoomRepository, 'findOneBy')
        .mockResolvedValueOnce(roomMock);

      await expect(service.removeRoom(roomId, diffMemberId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(findOneByMock).toHaveBeenCalledWith({ id: roomId });
    });
  });
});
