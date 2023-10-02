import { CreateEmployeeInput } from './create-employee.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {}