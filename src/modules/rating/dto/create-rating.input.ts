import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateRatingInput {
  @Field(() => Int)
  score: 1 | 2 | 3 | 4 | 5;

  @Field()
  comment: string;
}
