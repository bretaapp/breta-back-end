import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { VerifyCallback } from 'passport-google-oauth20';

@InputType()
export class OAuthLoginInput {
  @IsEmail({}, { message: 'Debes introducir un correo valido.' })
  @IsNotEmpty({ message: 'El campo email no puede estar vacío.' })
  email: string;

  @IsBoolean()
  @IsOptional()
  is_verified?: true | false;

  @IsString()
  @IsNotEmpty({ message: 'Debes introducir tu nombre' })
  full_name: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  done?: VerifyCallback;
}
