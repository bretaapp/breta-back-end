import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Salon } from '../salon/entities/salon.entity';
import { Address } from './entities/address.entity';

import { AddressService } from './address.service';

import { AddressResolver } from './address.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Salon])],
  providers: [AddressResolver, AddressService],
  exports: [AddressService],
})
export class AddressModule {}
