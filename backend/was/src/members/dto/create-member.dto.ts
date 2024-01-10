import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { KakaoAccount } from './kakao/kakao-account.dto';

export class CreateMemberDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly nickname: string;

  @IsUrl()
  @IsOptional()
  readonly profileUrl: string;

  static fromKakao(kakao: KakaoAccount): CreateMemberDto {
    return {
      email: kakao.email,
      nickname: kakao.nickname,
      profileUrl: kakao.profileUrl,
    };
  }
}