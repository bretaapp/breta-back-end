import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateServiceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Field(() => GraphQLJSON)
  @IsNotEmptyObject()
  cancellation: object;

  @Field(() => GraphQLJSON)
  @IsNotEmptyObject()
  timespan: object;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  employee_id?: number;
}
