import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { Roles } from '../role/entities/role.entity';
import { Salon } from '../salon/entities/salon.entity';

import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(Roles) private rolesRepo: Repository<Roles>,
    @InjectRepository(Salon) private salonRepo: Repository<Salon>,
  ) {}

  async create(
    salon_id: number,
    role_name: string,
    createEmployeeInput: CreateEmployeeInput,
  ) {
    const salon = await this.salonRepo.findOneBy({ salon_id });

    if (!salon) throw new BadRequestException(['Seleccione un salón valido']);

    const role = await this.rolesRepo.findOneBy({ role_name });

    if (!role) throw new BadRequestException(['Seleccione un rol valido']);

    const newEmployee = this.employeeRepo.create(createEmployeeInput);

    newEmployee.salon = salon;
    newEmployee.role = role;

    return this.employeeRepo.save(newEmployee);
  }

  async findAll() {
    const employees = await this.employeeRepo.find();

    if (!employees)
      throw new NotFoundException(['No se encontraron empleados']);

    return employees;
  }

  async findOne(employee_id: number) {
    const employee = await this.employeeRepo.findOne({
      where: { employee_id },
      relations: { salon: true, role: true },
    });

    if (!employee) throw new NotFoundException(['No se encontró el rating']);

    return employee;
  }

  async update(employee_id: number, updateEmployeeInput: UpdateEmployeeInput) {
    const employee = await this.employeeRepo.findOneBy({ employee_id });

    if (!employee)
      throw new BadRequestException(['Seleccione un empleado valido']);

    this.employeeRepo.merge(employee, updateEmployeeInput);

    return this.employeeRepo.save(employee);
  }

  async remove(employee_id: number) {
    const rating = await this.employeeRepo.findOneBy({ employee_id });

    if (!rating) throw new BadRequestException(['El rating no existe']);

    return this.employeeRepo.delete(employee_id);
  }
}
