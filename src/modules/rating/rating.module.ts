import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rating } from './entities/rating.entity';
import { User } from '../user/entities/user.entity';
import { Salon } from '../salon/entities/salon.entity';

import { RatingService } from './rating.service';

import { RatingResolver } from './rating.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Salon, User])],
  providers: [RatingResolver, RatingService],
})
export class RatingModule {}
