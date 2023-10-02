import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { ProfileModule } from '../profile/profile.module';
import { PaymentsModule } from '../payments/payments.module';

import { User } from '../user/entities/user.entity';

import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

const configService = new ConfigService();

import { config } from 'dotenv';
import { FacebookStrategy } from './strategy/facebook.strategy';
config();

@Global()
@Module({
  imports: [
    ProfileModule,
    PaymentsModule,
    EmailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: configService.get('JWT_SECRET'),
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
