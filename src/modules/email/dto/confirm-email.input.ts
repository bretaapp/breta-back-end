import { IsString, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ConfirmEmailInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}
