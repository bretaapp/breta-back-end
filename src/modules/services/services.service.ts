import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Salon } from '../salon/entities/salon.entity';
import { Service } from './entities/service.entity';

import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Salon) private salonRepo: Repository<Salon>,
  ) {}

  async create(salon_id: number, createServiceInput: CreateServiceInput) {
    const salon = await this.salonRepo.findOneBy({ salon_id });

    if (!salon) throw new BadRequestException(['No existe un salón valido']);

    const newService = this.serviceRepo.create(createServiceInput);
    newService.salon = salon;

    return this.serviceRepo.save(newService);
  }

  async findAll() {
    const services = await this.serviceRepo.find();

    if (!services) {
      throw new NotFoundException(['No se encontró ningún servicios']);
    }

    return services;
  }

  async findOne(service_id: number) {
    const service = await this.serviceRepo.findOneBy({ service_id });

    if (!service) throw new NotFoundException(['No se encontró el servicio']);

    return service;
  }

  async update(service_id: number, updateServiceInput: UpdateServiceInput) {
    const service = await this.serviceRepo.findOneBy({ service_id });

    if (!service) throw new NotFoundException(['No se encontró el servicio']);

    this.serviceRepo.merge(service, updateServiceInput);

    return this.serviceRepo.save(service);
  }

  async remove(service_id: number) {
    const service = await this.serviceRepo.findOneBy({ service_id });

    if (!service) throw new NotFoundException(['El servicio no existe']);

    return this.serviceRepo.delete(service_id);
  }
}
