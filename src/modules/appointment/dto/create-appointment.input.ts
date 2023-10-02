import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentInput {
  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field(() => [String])
  services_ids: string[];

  @Field(() => Number)
  salon_id: number;

  @Field(() => [Number])
  employees_ids: number[];
}
