import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import { ERR_MSG } from 'src/common/constants/errors';
import { PROVIDER_ID } from 'src/common/constants/etc';
import { KakaoLoginDecorator, LogoutDecorator } from './auth.decorators';
import { JwtPayloadDto } from './dto';
import { JwtAuthGuard } from './guard';
import { KakaoAuthService } from './service/kakao.auth.service';

dotenv.config();

@ApiTags('✅ Auth API')
@Controller('oauth')
export class AuthController {
  private readonly cookieOptions: object;
  constructor(private readonly kakaoAuthService: KakaoAuthService) {
    this.cookieOptions = {
      httpOnly: true,
      secure: process.env.ENV === 'PROD',
      sameSite: 'lax',
      maxAge: 3600,
    };
  }

  @Get('login/kakao')
  @KakaoLoginDecorator()
  async kakaoLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (req.cookies.magicconch) {
      throw new BadRequestException();
    }
    if (req.query.error) {
      throw new UnauthorizedException(ERR_MSG.OAUTH_KAKAO_AUTH_CODE_FAILED);
    }
    const jwt: string = await this.kakaoAuthService.loginOAuth(
      req.query.code as string,
    );
    res.cookie('magicconch', jwt, this.cookieOptions);
    res.sendStatus(200);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @LogoutDecorator()
  async kakaoLogout(@Req() req: any, @Res() res: Response): Promise<void> {
    const user: JwtPayloadDto = req.user;
    switch (user.providerId) {
      case PROVIDER_ID.KAKAO:
        await this.kakaoAuthService.logoutOAuth(user);
        break;
      case PROVIDER_ID.NAVER:
        break;
      case PROVIDER_ID.GOOGLE:
        break;
    }
    res.clearCookie('magicconch');
    res.sendStatus(200);
  }
}
