import { InputType, Field } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateOAuthUserInput {
  @Field()
  @IsEmail({}, { message: 'Debes introducir un correo valido.' })
  @IsNotEmpty({ message: 'El campo email no puede estar vacío.' })
  email: string;

  @Field()
  is_verified: true | false;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Debes introducir tu nombre' })
  full_name: string;

  @Field()
  @IsString()
  @IsOptional()
  profile_picture?: string;
}
