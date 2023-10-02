import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { Appointment } from './entities/appointment.entity';

import { AppointmentService } from './appointment.service';

import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Mutation(() => Appointment)
  createAppointment(
    @Args('profile_id') profile_id: string,
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentService.create(profile_id, createAppointmentInput);
  }

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Mutation(() => [Appointment])
  findByDate(
    @Args('start_date') start_date: Date,
    @Args('end_date', { nullable: true }) end_date?: Date,
  ) {
    return this.appointmentService.findByDate(start_date, end_date);
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('appointment_id', { type: () => ID }) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('appointment_id', { type: () => ID }) appointment_id: number,
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput,
  ) {
    return this.appointmentService.update(
      appointment_id,
      updateAppointmentInput,
    );
  }

  @Mutation(() => Appointment)
  removeAppointment(
    @Args('appointment_id', { type: () => ID }) appointment_id: number,
  ) {
    return this.appointmentService.remove(appointment_id);
  }
}
