import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';
import { Salon } from '../salon/entities/salon.entity';
import { Roles } from '../role/entities/role.entity';

import { EmployeesService } from './employees.service';
import { EmployeesResolver } from './employees.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Salon, Roles])],
  providers: [EmployeesService, EmployeesResolver],
  exports: [EmployeesService],
})
export class EmployeesModule {}
