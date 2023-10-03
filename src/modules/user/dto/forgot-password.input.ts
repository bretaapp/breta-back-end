import { IsEmail } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
    email: string;
}
