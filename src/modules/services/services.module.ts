import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Salon } from '../salon/entities/salon.entity';
import { Service } from './entities/service.entity';

import { ServicesService } from './services.service';

import { ServicesResolver } from './services.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Salon])],
  providers: [ServicesResolver, ServicesService],
})
export class ServicesModule {}
