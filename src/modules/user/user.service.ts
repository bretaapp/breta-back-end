import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { HashService } from 'src/services/hash.service';
import { ProfileService } from '../profile/profile.service';
import { PaymentsService } from '../payments/payments.service';
import { EmailConfirmationService } from '../email/email-confirmation.service';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ConfirmEmailInput } from '../email/dto/confirm-email.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ForgotPasswordTokenInput } from './dto/forgot-password-token.input';

import { UpdateProfileInput } from '../profile/dto/update-profile.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    private hashService: HashService,
    private profileService: ProfileService,
    private paymentsService: PaymentsService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  async create(payload: CreateUserInput): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: payload.email },
    });
    if (user) throw new BadRequestException([['El usuario ya existe']]);

    payload.password = await this.hashService.hash(payload.password);

    const newUser = this.userRepo.create(payload);

    if (newUser) {
      await this.emailConfirmationService.sendVerificationLink(
        payload.email,
        payload.full_name,
      );
    }

    if (newUser.type === 'customer') {
      const stripeCustomer = await this.paymentsService.createStripeCustomer(
        payload.full_name,
        payload.email,
        payload.type,
      );

      newUser.stripe_customer_id = stripeCustomer.id;
    }

    await this.userRepo.save(newUser);

    await this.profileService.create(newUser.user_id);

    return newUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find();
    if (!users) throw new NotFoundException(['No se encontraron usuarios']);

    return users;
  }

  async findOne(user_id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      relations: { profile: true },
      where: { user_id },
    });
    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    return user;
  }

  async update(
    user_id: string,
    updateUserInput: UpdateUserInput,
    updateProfileInput?: UpdateProfileInput,
  ): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { user_id },
      relations: { profile: true },
    });
    if (!user) throw new NotFoundException(['No se encontró al usuario']);

    if (updateUserInput.password) {
      const password = updateUserInput.password;
      updateUserInput.password = await this.hashService.hash(password);
    }

    this.userRepo.merge(user, updateUserInput);

    if (updateProfileInput) {
      const profile = await this.profileRepo.findOneBy({
        profile_id: user.profile.profile_id,
      });

      this.profileRepo.merge(profile, updateProfileInput);

      this.profileRepo.save(profile);
    }

    return this.userRepo.save(user);
  }

  // async changePassword(user_id: string) {
  //   const user = await this.userRepo.findOneBy({ user_id });

  //   if (!user) throw new BadRequestException(['El usuario no es valido']);

  //   this.userRepo.merge();
  // }

  async emailConfirmed(email: string) {
    return await this.userRepo.update(
      { email },
      {
        is_verified: true,
      },
    );
  }

  public async confirmEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (user.is_verified) {
      throw new BadRequestException(['Email already confirmed']);
    }
    return await this.emailConfirmed(email);
  }

  async confirm(confirmationData: ConfirmEmailInput) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    return await this.confirmEmail(email);
  }

  async requestPasswordReset (forgotPassword: ForgotPasswordInput) {
    const user = await this.findOneByEmail(forgotPassword.email);

    if(!user) {
      throw new Error('Ususario no encontrado');
    }

    const send = this.emailConfirmationService.sendForgotPasswordLink(forgotPassword.email);
    return user 
  }

  async verifyToken(token: ForgotPasswordTokenInput) {
    const email =  await this.emailConfirmationService.decodeConfirmationToken(
      token.token
    )

    const user = await this.userRepo.findOne({
      where: { email },
    });

    return user
  }

  async resetPass (email: string, changes: UpdateUserInput) {
    const user = await this.userRepo.findOneBy({email});
    if(!user) throw new NotFoundException(['No se encontro al usuario']);
    const validatePass = await bcrypt.compare(changes.password, user.password);

    if(!changes.password) {
      throw new BadRequestException(['Rellena los campos porfavor']);
    }

    if(validatePass === true) {
      throw new BadRequestException(['No puedes usar la misma contraseña']);
    }

    const saltRounds = 10;
    const password = changes.password;
    const hash = await bcrypt.hash(password, saltRounds);
    changes.password = hash;

    this.userRepo.merge(user, changes);

    return this.userRepo.save(user);
  }

  async remove(user_id: string) {
    const user = await this.userRepo.findOneBy({ user_id });
    if (!user) throw new NotFoundException(['El usuario no existe']);

    if (user.type === 'customer') {
      this.paymentsService.deleteStripeCustomer(user.stripe_customer_id);
    }

    return this.userRepo.delete(user_id);
  }
}
