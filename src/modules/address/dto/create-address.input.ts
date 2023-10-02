import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  street: string;

  @Field(() => Number)
  postal_code: number;

  @Field(() => Number)
  exterior_number: number;

  @Field(() => Number, { nullable: true })
  interior_number: number;
}
