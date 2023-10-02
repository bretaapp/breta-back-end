import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Roles } from './entities/role.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Salon } from '../salon/entities/salon.entity';

import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Employee, Salon])],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}
