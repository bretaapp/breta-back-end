import { Service } from './entities/service.entity';

import { ServicesService } from './services.service';

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(private readonly servicesService: ServicesService) {}

  @Mutation(() => Service)
  createService(
    @Args('salon_id', { type: () => ID }) salon_id: number,
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
  ) {
    return this.servicesService.create(salon_id, createServiceInput);
  }

  @Query(() => [Service], { name: 'services' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Query(() => Service, { name: 'service' })
  findOne(@Args('service_id', { type: () => ID }) service_id: number) {
    return this.servicesService.findOne(service_id);
  }

  @Mutation(() => Service)
  updateService(
    @Args('service_id', { type: () => ID }) service_id: number,
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
  ) {
    return this.servicesService.update(service_id, updateServiceInput);
  }

  @Mutation(() => Service)
  removeService(@Args('service_id', { type: () => ID }) service_id: number) {
    return this.servicesService.remove(service_id);
  }
}
