import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Appointment } from './entities/appointment.entity';
import { Profile } from '../profile/entities/profile.entity';

import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { Service } from '../services/entities/service.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Salon } from '../salon/entities/salon.entity';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
    @InjectRepository(Service)
    private servicesRepo: Repository<Service>,
    @InjectRepository(Salon)
    private salonRepo: Repository<Salon>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    profile_id: string,
    createAppointmentInput: CreateAppointmentInput,
  ) {
    const profile = await this.profileRepo.findOneBy({ profile_id });

    if (!profile) {
      throw new BadRequestException(['Selecciona un perfil valido']);
    }

    const services = await this.servicesRepo.find({
      where: { service_id: In(createAppointmentInput.services_ids) },
    });

    if (!services || services.length === 0) {
      throw new BadRequestException([
        'Selecciona por lo menos un servicio valido',
      ]);
    }

    const salon = await this.salonRepo.findOne({
      where: { salon_id: createAppointmentInput.salon_id },
    });

    if (!salon) throw new BadRequestException(['Selecciona un salon valido']);

    const employees = await this.employeeRepo.find({
      where: { employee_id: In(createAppointmentInput.employees_ids) },
    });

    if (!employees || employees.length === 0) {
      throw new BadRequestException([
        'Selecciona por lo menos a un empleado valido',
      ]);
    }

    const conflictingAppointments = await this.appointmentRepo.find({
      relations: { attended_by: true },
      where: {
        start: Between(
          createAppointmentInput.start,
          createAppointmentInput.end,
        ),
        attended_by: In(createAppointmentInput.employees_ids),
      },
    });

    if (conflictingAppointments) {
      throw new BadRequestException(['No es posible agendar cita']);
    }

    const newAppointment = this.appointmentRepo.create(createAppointmentInput);

    newAppointment.salon = salon;
    newAppointment.subscriber = profile;
    newAppointment.services = services;
    newAppointment.attended_by = employees;

    return this.appointmentRepo.save(newAppointment);
  }

  async findAll() {
    const appointments = await this.appointmentRepo.find({
      relations: { subscriber: true, services: true, salon: true },
    });

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(['No se encontró ninguna cita']);
    }

    return appointments;
  }

  async findOne(appointment_id: number) {
    const appointment = await this.appointmentRepo.findOne({
      where: { appointment_id },
      relations: { subscriber: true, services: true, salon: true },
    });

    if (!appointment) {
      throw new NotFoundException(['No se encontró la cita']);
    }

    return appointment;
  }

  async findByDate(start: Date, end: Date) {
    const appointments = await this.appointmentRepo.find({
      relations: { services: { employee: true }, salon: true },
      where: [{ start: Between(start, end) }],
    });

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException('No se encontraron citas para esta fecha');
    }

    return appointments;
  }

  async update(
    appointment_id: number,
    updateAppointmentInput: UpdateAppointmentInput,
  ) {
    const appointment = await this.appointmentRepo.findOne({
      relations: { subscriber: true },
      where: { appointment_id },
    });

    if (!appointment) throw new BadRequestException(['Cita equivocada']);

    this.appointmentRepo.merge(appointment, updateAppointmentInput);

    if (appointment.status === 'rejected') {
      this.notificationsService.create(appointment.subscriber.profile_id, {
        message: 'Tú cita fue rechazada',
      });
      return this.remove(appointment.appointment_id);
    }

    return this.appointmentRepo.save(appointment);
  }

  async remove(appointment_id: number) {
    const appointment = this.appointmentRepo.findOneBy({
      appointment_id,
    });

    if (!appointment) throw new BadRequestException(['La cita no existe']);

    return this.appointmentRepo.delete(appointment_id);
  }
}
