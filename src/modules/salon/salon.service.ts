import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Salon } from './entities/salon.entity';
import { User } from '../user/entities/user.entity';

import { CreateSalonInput } from './dto/create-salon.input';
import { UpdateSalonInput } from './dto/update-salon.input';
import { FindByInput } from './dto/findBy.input';
import { CreateAddressInput } from '../address/dto/create-address.input';
import { AddressService } from '../address/address.service';
import { UpdateAddressInput } from '../address/dto/update-address.input';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class SalonService {
  constructor(
    @InjectRepository(Salon) private salonRepo: Repository<Salon>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    private addressService: AddressService,
  ) {}

  async create(
    user_id: string,
    createSalonInput: CreateSalonInput,
    createAddressInput?: CreateAddressInput | null,
  ) {
    const user = await this.userRepo.findOne({
      where: { user_id },
      relations: { profile: true },
    });

    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    const profile = user.profile;

    const newSalon = await this.salonRepo.create(createSalonInput);
    newSalon.owner = profile;

    if (createAddressInput) {
      const newAddress = this.addressRepo.create(createAddressInput);
      newAddress.salon = newSalon;
    } else {
      this.addressRepo.create({ is_auto_generated: true });
    }

    return this.salonRepo.save(newSalon);
  }

  async findAll() {
    const salons = await this.salonRepo.find({
      relations: { services: true, ratings: true, address: true },
    });

    if (!salons) throw new NotFoundException(['No se encontraron salones']);

    return salons;
  }

  async findBy(findByInput: FindByInput) {
    const salons = await this.salonRepo.find({
      relations: { services: true, ratings: true, owner: true, address: true },
      where: [
        {
          salon_name: ILike(`%${findByInput.search_input}%`),
        },
        {
          services: { service_name: ILike(`%${findByInput.search_input}%`) },
        },
      ],
      order: { salon_name: 'ASC' },
    });

    if (!salons || salons.length === 0) {
      throw new NotFoundException([
        `No se encontraron resultados similares a: ${findByInput.search_input}`,
      ]);
    }

    return salons;
  }

  async findOne(salon_id: number) {
    const salon = await this.salonRepo.findOne({
      where: { salon_id },
      relations: {
        services: true,
        ratings: true,
        owner: true,
        address: true,
        roles: true,
        employee: { role: true },
      },
    });

    if (!salon) throw new NotFoundException(['No se encontró el salón']);

    return salon;
  }

  async update(
    salon_id: number,
    updateSalonInput: UpdateSalonInput,
    updateAddressInput?: UpdateAddressInput,
  ) {
    const salon = await this.salonRepo.findOne({
      relations: { address: true },
      where: { salon_id },
    });

    if (!salon) throw new NotFoundException(['No se encontró el salón']);

    this.salonRepo.merge(salon, updateSalonInput);

    if (updateAddressInput) {
      this.addressService.update(salon.address.address_id, updateAddressInput);
    }

    return this.salonRepo.save(salon);
  }

  async remove(salon_id: number) {
    const salon = await this.salonRepo.findOneBy({ salon_id });

    if (!salon) throw new NotFoundException(['El salón no existe']);

    this.salonRepo.delete(salon_id);
  }
}
