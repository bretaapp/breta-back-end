import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { Employee } from './entities/employee.entity';

import { EmployeesService } from './employees.service';

import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@Resolver()
export class EmployeesResolver {
  constructor(private readonly employeeService: EmployeesService) {}

  @Mutation(() => Employee)
  createEmployee(
    @Args('salon_id') salon_id: number,
    @Args('role_name') role_name: string,
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
  ) {
    return this.employeeService.create(
      salon_id,
      role_name,
      createEmployeeInput,
    );
  }

  @Query(() => [Employee], { name: 'employees' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Query(() => Employee, { name: 'employee' })
  findOne(@Args('employee_id', { type: () => Int }) employee_id: number) {
    return this.employeeService.findOne(employee_id);
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args('employee_id', { type: () => ID }) employee_id: number,
    @Args('updateEmployeeInput') updateEmployeeInput: UpdateEmployeeInput,
  ) {
    return this.employeeService.update(employee_id, updateEmployeeInput);
  }

  @Mutation(() => Employee)
  removeEmployee(@Args('employee_id', { type: () => ID }) employee_id: number) {
    return this.employeeService.remove(employee_id);
  }
}
