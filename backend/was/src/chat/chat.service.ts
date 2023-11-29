import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERR_MSG } from 'src/common/constants/errors';
import { LoggerService } from 'src/logger/logger.service';
import { Member } from 'src/members/entities/member.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ChattingMessageResponseDto } from './dto/chatting-messag-response.dto';
import { ChattingRoomResponseDto } from './dto/chatting-room-response.dto';
import { CreateChattingMessageDto } from './dto/create-chatting-message.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';
import { ChattingMessage } from './entities/chatting-message.entity';
import { ChattingRoom } from './entities/chatting-room.entity';

export interface ChattingInfo {
  memeberId: string;
  roomId: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChattingRoom)
    private readonly chattingRoomRepository: Repository<ChattingRoom>,
    @InjectRepository(ChattingMessage)
    private readonly chattingMessageRepository: Repository<ChattingMessage>,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    private readonly logger: LoggerService,
  ) {}

  async createRoom(memberId: string): Promise<ChattingInfo> {
    /**
     * 임시로 쿠키 대신 사용
     */
    const member: Member = new Member();
    const savedMember: Member = await this.membersRepository.save(member);

    // const member: Member | null = await this.membersRepository.findOneBy({
    //   id: memberId,
    // });
    // if (!member) {
    //   throw new NotFoundException();
    // }

    const room: ChattingRoom = new ChattingRoom();
    room.participant = savedMember;

    try {
      const savedRoom: ChattingRoom =
        await this.chattingRoomRepository.save(room);
      return { memeberId: savedMember.id, roomId: savedRoom.id };
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        this.logger.error(
          `Failed to create chatting room : ${err.message}`,
          err.stack,
        );
        if (err.message.includes('UNIQUE')) {
          throw new Error(ERR_MSG.NOT_UNIQUE);
        }
        throw new Error(ERR_MSG.UNKNOWN_DATABASE);
      }
      throw new Error(ERR_MSG.UNKNOWN);
    }
  }

  async createMessage(
    roomId: string,
    createChattingMessageDto: CreateChattingMessageDto[],
  ): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({
        id: roomId,
      });
    if (!room) {
      this.logger.error(
        `Failed to create chatting message : ${ERR_MSG.CHATTING_ROOM_NOT_FOUND}`,
      );
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    try {
      createChattingMessageDto.forEach(
        async (messageDto: CreateChattingMessageDto) => {
          const message = new ChattingMessage();
          message.roomId = room;
          message.isHost = messageDto.isHost;
          message.message = messageDto.message;
          await this.chattingMessageRepository.save(message);
        },
      );
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        this.logger.error(
          `Failed to create chatting message : ${err.message}`,
          err.stack,
        );
        if (err.message.includes('UNIQUE')) {
          throw new Error(ERR_MSG.NOT_UNIQUE);
        }
        throw new Error(ERR_MSG.UNKNOWN_DATABASE);
      }
      throw new Error(ERR_MSG.UNKNOWN);
    }
  }

  async findRoomsById(id: string): Promise<ChattingRoomResponseDto[]> {
    const rooms: ChattingRoom[] = await this.chattingRoomRepository.findBy({
      id,
    });
    return rooms.map((room: ChattingRoom) => {
      const roomDto: ChattingRoomResponseDto = new ChattingRoomResponseDto();
      roomDto.id = room.id;
      roomDto.title = room.title;
      return roomDto;
    });
  }

  async findMessagesById(id: string): Promise<ChattingMessageResponseDto[]> {
    const messages: ChattingMessage[] =
      await this.chattingMessageRepository.findBy({ id });
    return messages.map((message: ChattingMessage) => {
      const messageDto = new ChattingMessageResponseDto();
      messageDto.id = message.id;
      messageDto.isHost = message.isHost;
      messageDto.message = message.message;
      return messageDto;
    });
  }

  async updateRoom(
    id: string,
    memberId: string,
    updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id });
    if (!room) {
      this.logger.error(
        `Failed to update chatting room : ${ERR_MSG.CHATTING_ROOM_NOT_FOUND}`,
      );
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      this.logger.error(
        `Failed to update chatting room : ${ERR_MSG.DELETE_CHATTING_ROOM_FORBIDDEN}`,
      );
      throw new ForbiddenException(ERR_MSG.UPDATE_CHATTING_ROOM_FORBIDDEN);
    }
    try {
      await this.chattingRoomRepository.update(
        { id },
        { title: updateChattingRoomDto.title },
      );
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        this.logger.error(
          `Failed to update chatting room : ${err.message}`,
          err.stack,
        );
        if (err.message.includes('FOREIGN KEY')) {
          throw new Error(ERR_MSG.INVALID_FOREIGN_KEY);
        }
        throw new Error(ERR_MSG.UNKNOWN_DATABASE);
      }
      throw new Error(ERR_MSG.UNKNOWN);
    }
  }

  async removeRoom(id: string, memberId: string): Promise<void> {
    const room: ChattingRoom | null =
      await this.chattingRoomRepository.findOneBy({ id });
    if (!room) {
      this.logger.error(
        `Failed to delete chatting room : ${ERR_MSG.CHATTING_ROOM_NOT_FOUND}`,
      );
      throw new NotFoundException(ERR_MSG.CHATTING_ROOM_NOT_FOUND);
    }
    if (room.participant.id !== memberId) {
      this.logger.error(
        `Failed to delete chatting room : ${ERR_MSG.DELETE_CHATTING_ROOM_FORBIDDEN}`,
      );
      throw new ForbiddenException(ERR_MSG.DELETE_CHATTING_ROOM_FORBIDDEN);
    }
    try {
      await this.chattingRoomRepository.softDelete({ id });
    } catch (err: unknown) {
      if (err instanceof QueryFailedError) {
        this.logger.error(
          `Failed to delete chatting room : ${err.message}`,
          err.stack,
        );
        if (err.message.includes('optimistic lock')) {
          throw new Error(ERR_MSG.OPTIMISTIC_LOCK);
        }
        throw new Error(ERR_MSG.UNKNOWN_DATABASE);
      }
      throw new Error(ERR_MSG.UNKNOWN);
    }
  }
}