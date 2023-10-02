import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { Address } from './entities/address.entity';

import { AddressService } from './address.service';

import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  @Mutation(() => Address)
  createAddress(
    @Args('salon_id') salon_id: number,
    @Args('createAddressInput') createAddressInput: CreateAddressInput,
  ) {
    return this.addressService.create(salon_id, createAddressInput);
  }

  @Query(() => [Address], { name: 'addresses' })
  findAll() {
    return this.addressService.findAll();
  }

  @Query(() => Address, { name: 'address' })
  findOne(@Args('address_id', { type: () => ID }) address_id: number) {
    return this.addressService.findOne(address_id);
  }

  @Mutation(() => Address)
  updateAddress(
    @Args('address_id', { type: () => ID }) address_id: number,
    @Args('updateAddressInput') updateAddressInput: UpdateAddressInput,
  ) {
    return this.addressService.update(address_id, updateAddressInput);
  }

  @Mutation(() => Address)
  removeAddress(@Args('address_id', { type: () => ID }) address_id: number) {
    return this.addressService.remove(address_id);
  }
}
