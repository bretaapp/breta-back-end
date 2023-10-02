import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from '../profile/profile.module';

import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';

import { UserService } from './user.service';

import { UserResolver } from './user.resolver';
import { PaymentsModule } from '../payments/payments.module';
import { HashService } from 'src/services/hash.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    EmailModule,
    ProfileModule,
    PaymentsModule,
  ],
  providers: [UserResolver, UserService, HashService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
