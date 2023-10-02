import { InputType, Field } from '@nestjs/graphql';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'Debes introducir un correo valido.' })
  @IsNotEmpty({ message: 'El campo email no puede estar vacío.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, {
    message: 'La contraseña no puede ser menor a 8 caracteres',
  })
  @MaxLength(30, {
    message: 'La contraseña no puede ser mayor a 30 caracteres',
  })
  password: string;

  @Field()
  @IsString()
  @IsOptional()
  type: 'owner' | 'customer' = 'customer';

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Debes introducir tu nombre' })
  full_name: string;

  @Field()
  @IsString()
  @IsPhoneNumber('MX', {
    message: 'Debes introducir un número de teléfono valido',
  })
  @IsNotEmpty({ message: 'Debes introducir un número de teléfono' })
  cellphone: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  birthday: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender: 'male' | 'female' | 'undetermined' = 'undetermined';
}
