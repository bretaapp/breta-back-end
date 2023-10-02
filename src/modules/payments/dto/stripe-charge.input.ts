import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsNumber } from 'class-validator';

@InputType()
export class StripeChargeInput {
  @Field(() => Int)
  @IsNumber()
  amount: number;

  @Field(() => [String])
  @IsArray()
  paymentMethodTypes: string[];

  @Field()
  currency: string;
}
