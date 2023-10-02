import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateSalonInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  salon_name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsPhoneNumber('MX')
  cellphone: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  main_picture: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  wallpaper: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  image_gallery?: object[];

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [GraphQLJSON])
  schedule: object[];

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  size: number;
}
