import { User } from './entities/user.entity';

import { UserService } from './user.service';
import { AuthService } from '../authn/auth.service';

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth/jwt-auth.guard';

import { LoginInput } from './dto/login.input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ConfirmEmailInput } from '../email/dto/confirm-email.input';
import { UpdateProfileInput } from '../profile/dto/update-profile.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ForgotPasswordTokenInput } from './dto/forgot-password-token.input';

import { LoginResponse } from './dto/login-response';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('user_id', { type: () => String }) user_id: string) {
    return this.userService.findOne(user_id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('updateProfileInput', { nullable: true })
    updateProfileInput?: UpdateProfileInput,
  ) {
    return this.userService.update(
      user_id,
      updateUserInput,
      updateProfileInput,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  removeUser(@Args('user_id', { type: () => ID }) user_id: string) {
    return this.userService.remove(user_id);
  }

  @Mutation(() => LoginResponse, { name: 'login' })
  login(@Args('loginUserInput') loginUserInput: LoginInput) {
    return this.authService.jwtLogin(loginUserInput);
  }

  @Mutation(() => User)
  confirmEmail(
    @Args('confirmEmailInput') confirmEmailInput: ConfirmEmailInput,
  ) {
    return this.userService.confirm(confirmEmailInput);
  }

  @Mutation(() => User)
  requestForgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput, 
  ) {
    return this.userService.requestPasswordReset(forgotPasswordInput);
  }

  @Mutation(() => User)
  updatePassword(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.resetPass(email, updateUserInput);
  }

  @Mutation(() => User)
  verifyToken(
    @Args('forgotPasswordTokenInput') forgotPasswordTokenInput:ForgotPasswordTokenInput,
  ) {
    return this.userService.verifyToken(forgotPasswordTokenInput);
  }
}
