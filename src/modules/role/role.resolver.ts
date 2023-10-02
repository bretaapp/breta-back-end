import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { Roles } from './entities/role.entity';

import { RoleService } from './role.service';

import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Resolver()
export class RoleResolver {
    constructor(private readonly roleService: RoleService) {}

    @Mutation(() => Roles)
    createRole(
        @Args('salon_id') salon_id: number,
        @Args('createRoleInput') createRoleInput: CreateRoleInput
    ) {
        return this.roleService.create(salon_id, createRoleInput);
    }

    @Query(() => [Roles], {name: 'roles'})
    findAll() {
        return this.roleService.findAll();
    }

    @Query(() => Roles, {name: 'roles'})
    findOne(@Args('role_id', {type: () => Int}) role_id: number) {
        return this.roleService.findOne(role_id);
    }

    @Mutation(() => Roles)
    updateRole(
        @Args('role_id', {type: () => ID}) role_id: number,
        @Args('updateRoleInput') updateRoleInput: UpdateRoleInput
    ) {
        return this.roleService.update(role_id, updateRoleInput);
    }

    @Mutation(() => Roles)
    remove(@Args('role_id', {type: () => ID}) role_id: number) {
        return this.roleService.remove(role_id);
    }
}
