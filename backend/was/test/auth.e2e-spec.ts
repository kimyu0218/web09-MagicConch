import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { MockedKakaoAuthService } from 'src/auth/__mocks__/kakao.auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { JwtAuthGuard, SocketJwtAuthGuard } from 'src/auth/guard';
import { AuthService, KakaoAuthService } from 'src/auth/service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { RedisCacheModule } from 'src/common/config/cache/redis-cache.module';
import { ERR_MSG } from 'src/common/constants/errors';
import { Member } from 'src/members/entities';
import * as request from 'supertest';
import { jwtToken } from './constants';

dotenv.config();

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RedisCacheModule.register(),
        PassportModule,
        JwtModule.registerAsync({
          useFactory: (): JwtModule => {
            return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
            };
          },
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/entities/*.entity.{js,ts}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member]),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        KakaoAuthService,
        JwtStrategy,
        JwtAuthGuard,
        SocketJwtAuthGuard,
      ],
    })
      .overrideProvider(KakaoAuthService)
      .useClass(MockedKakaoAuthService)
      .compile();

    app = moduleRef.createNestApplication();

    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /oauth/login/kakao', () => {
    const code: string = 'code';
    const wrongCode: string = 'wrongCode';
    const codeGetUserFail: string = 'codeGetUserFail';

    describe('성공', () => {
      it(`[인증 받지 않은 사용자/올바른 인증코드] GET /oauth/login/kakao?code=${code}`, () => {
        return request(app.getHttpServer())
          .get(`/oauth/login/kakao?code=${code}`)
          .expect(200);
      });
    });

    describe('실패', () => {
      [
        {
          scenario: '[인증 받은 사용자] GET /oauth/login/kakao',
          route: '/oauth/login/kakao',
          cookie: `magicconch=${jwtToken}`,
          status: 400,
        },
        {
          scenario:
            '[인증 받지 않은 사용자/인증코드 누락] GET /oauth/login/kakao',
          route: '/oauth/login/kakao',
          status: 400,
        },
        {
          scenario: `[인증 받지 않은 사용자/올바르지 않은 인증코드] GET /oauth/login/kakao?code=${wrongCode}`,
          route: `/oauth/login/kakao?code=${wrongCode}`,
          status: 401,
          message: ERR_MSG.OAUTH_KAKAO_TOKEN_FAILED,
        },
        {
          scenario: `[인증 받지 않은 사용자/올바른 인증 코드/사용자 정보 조회 실패] GET /oauth/login/kakao?code=${codeGetUserFail}`,
          route: `/oauth/login/kakao?code=${codeGetUserFail}`,
          status: 400,
          message: ERR_MSG.OAUTH_KAKAO_USER_FAILED,
        },
      ].forEach(({ scenario, route, cookie, status, message }) => {
        it(scenario, () => {
          if (cookie) {
            return request(app.getHttpServer())
              .get(route)
              .set('Cookie', cookie)
              .expect(status);
          }
          if (!message) {
            return request(app.getHttpServer()).get(route).expect(status);
          }
          return request(app.getHttpServer())
            .get(route)
            .expect(status)
            .expect((res) => expect(res.body.message).toBe(message));
        });
      });
    });
  });

  describe('GET /oauth/logout', () => {
    describe('성공', () => {
      it('[인증 받은 사용자] GET /oauth/logout', () => {
        return request(app.getHttpServer())
          .get('/oauth/logout')
          .set('Cookie', `magicconch=${jwtToken}`)
          .expect(200);
      });
    });

    describe('실패', () => {
      it('[인증 받지 않은 사용자] GET /oauth/logout', () => {
        return request(app.getHttpServer()).get('/oauth/logout').expect(401);
      });
    });
  });
});
