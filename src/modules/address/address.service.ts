import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Address } from './entities/address.entity';
import { Salon } from '../salon/entities/salon.entity';

import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    @InjectRepository(Salon) private salonRepo: Repository<Salon>,
  ) {}

  async create(salon_id: number, createAddressInput: CreateAddressInput) {
    const salon = await this.salonRepo.findOneBy({ salon_id });

    if (!salon) {
      throw new BadRequestException(['Por favor utilize un salón valido']);
    }

    const newAddress = this.addressRepo.create(createAddressInput);

    newAddress.salon = salon;

    return this.addressRepo.save(newAddress);
  }

  async findAll() {
    const addresses = await this.addressRepo.find();

    if (!addresses) {
      throw new NotFoundException(['No sen encontraron direcciones']);
    }

    return addresses;
  }

  async findOne(address_id: number) {
    const address = await this.addressRepo.findOne({
      where: { address_id },
      relations: { salon: true },
    });

    if (!address) {
      throw new BadRequestException(['Favor de utilizar un salón valido']);
    }

    return address;
  }

  async update(address_id: number, updateAddressInput: UpdateAddressInput) {
    const address = await this.addressRepo.findOneBy({ address_id });

    if (!address) {
      throw new BadRequestException(['Favor de utilizar una dirección valida']);
    }

    this.addressRepo.merge(address, updateAddressInput);

    return this.addressRepo.save(address);
  }

  async remove(address_id: number) {
    const address = await this.addressRepo.findOneBy({ address_id });

    if (!address) {
      throw new BadRequestException(['Esa dirección no existe']);
    }

    return this.addressRepo.delete(address_id);
  }
}
