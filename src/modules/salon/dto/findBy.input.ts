import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class FindByInput {
  @Field({ nullable: true })
  @Length(2, 100, { message: 'Debes ingresar por lo menos 2 caracteres' })
  @IsString()
  @IsOptional()
  search_input?: string;
}
