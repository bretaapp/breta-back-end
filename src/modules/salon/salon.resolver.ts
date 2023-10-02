import { Salon } from './entities/salon.entity';

import { SalonService } from './salon.service';

import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { FindByInput } from './dto/findBy.input';
import { CreateSalonInput } from './dto/create-salon.input';
import { UpdateSalonInput } from './dto/update-salon.input';
import { CreateAddressInput } from '../address/dto/create-address.input';
import { UpdateAddressInput } from '../address/dto/update-address.input';

@Resolver(() => Salon)
export class SalonResolver {
  constructor(private readonly salonService: SalonService) {}

  @Mutation(() => Salon)
  createSalon(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('createSalonInput') createSalonInput: CreateSalonInput,
    @Args('createAddressInput', { nullable: true, defaultValue: null })
    createAddressInput?: CreateAddressInput | null,
  ) {
    return this.salonService.create(
      user_id,
      createSalonInput,
      createAddressInput,
    );
  }

  @Query(() => [Salon], { name: 'salons' })
  findAll() {
    return this.salonService.findAll();
  }

  @Query(() => [Salon], { name: 'findSalonsBy' })
  findBy(@Args('findByInput') findByInput: FindByInput) {
    return this.salonService.findBy(findByInput);
  }

  @Query(() => Salon, { name: 'salon' })
  findOne(@Args('salon_id', { type: () => Int }) salon_id: number) {
    return this.salonService.findOne(salon_id);
  }

  @Mutation(() => Salon)
  updateSalon(
    @Args('salon_id', { type: () => ID }) salon_id: number,
    @Args('updateSalonInput') updateSalonInput: UpdateSalonInput,
    @Args('updateAddressInput', { nullable: true })
    updateAddressInput?: UpdateAddressInput,
  ) {
    return this.salonService.update(
      salon_id,
      updateSalonInput,
      updateAddressInput,
    );
  }

  @Mutation(() => Salon)
  removeSalon(@Args('salon_id', { type: () => ID }) salon_id: number) {
    return this.salonService.remove(salon_id);
  }
}
