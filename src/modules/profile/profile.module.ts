import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Profile } from './entities/profile.entity';

import { ProfileService } from './profile.service';

import { ProfileResolver } from './profile.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
