import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Debes introducir un correo valido' })
  @IsNotEmpty({ message: 'Debes introducir un correo' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Debes introducir una contraseña' })
  password: string;

  @Field(() => Boolean, { nullable: true })
  remember_me?: true | false = false;
}
