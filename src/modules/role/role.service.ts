import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from './entities/role.entity';
import { Salon } from '../salon/entities/salon.entity';

import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Roles) private rolesRepo: Repository<Roles>,
        @InjectRepository(Salon) private salonRepo: Repository<Salon>
    ) {}

    async create (
        salon_id: number,
        createRoleInput: CreateRoleInput
    ) {
        const salon = await this.salonRepo.findOneBy({ salon_id });

        if (!salon) throw new BadRequestException(['Seleccione un salon valido']);

        const newRole = this.rolesRepo.create(createRoleInput);

        newRole.salon = salon;

        return this.rolesRepo.save(newRole);
    }

    async findAll() {
        const roles = await this.rolesRepo.find();

        if(!roles) throw new NotFoundException (['No se encontraron roles'])

        return roles
    }

    async findOne(role_id: number) {
        const role = await this.rolesRepo.findOne({
            where: { role_id },
            relations: { salon: true }
        });

        if(!role) throw new NotFoundException(['No se encontró el rol']);

        return role;
    }

    async update( role_id:  number, updateRoleInput:UpdateRoleInput) {
        const role = await this.rolesRepo.findOneBy({ role_id });

        if(!role) throw new BadRequestException(['Seleccione un rol valido'])

        this.rolesRepo.merge(role, updateRoleInput);

        return this.rolesRepo.save(role);
    }

    async remove(role_id: number){
        const role = await this.rolesRepo.findOneBy({ role_id });

        if(!role) throw new BadRequestException(['Seleccione un rol valido'])

        return this.rolesRepo.delete(role_id);
    }
}
