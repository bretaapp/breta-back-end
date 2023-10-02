import { CreateAppointmentInput } from './create-appointment.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {
  @Field({ nullable: true })
  status: 'accepted' | 'rejected' | 'undetermined';
}
