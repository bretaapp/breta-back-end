import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @Field()
  message: string;
}
