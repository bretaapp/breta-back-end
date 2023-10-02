import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

@InputType()
export class CreateEmployeeInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  profile_picture: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('MX')
  cellphone: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  commission: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  paymentCycle: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  payday: string;
}
