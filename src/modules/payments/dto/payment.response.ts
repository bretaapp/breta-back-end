import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponse {
  @Field()
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field(() => [String])
  payment_method_types: string[];
}
