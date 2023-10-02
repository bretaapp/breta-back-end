import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import { PaymentsService } from '../payments/payments.service';
import { EmailConfirmationService } from '../email/email-confirmation.service';

import { LoginInput } from '../user/dto/login.input';
import { OAuthLoginInput } from '../user/dto/oauth.input';

import { CreateOAuthUserInput } from '../user/dto/create-oauth-user.input';

import { Request } from 'express';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private profileService: ProfileService,
    private paymentsService: PaymentsService,
    private emailConfirmationService: EmailConfirmationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthUser(
    payload: Promise<OAuthLoginInput> | OAuthLoginInput | any,
  ): Promise<User> {
    const done = payload.done;

    const user = await this.userRepo.findOneBy({ email: payload.email });

    if (user) {
      done(null, user);
      return user;
    }

    const data: CreateOAuthUserInput = {
      email: payload.email,
      full_name: payload.full_name,
      is_verified: payload.is_verified,
    };

    const newUser = this.userRepo.create(data);

    if (!newUser.is_verified) {
      await this.emailConfirmationService.sendVerificationLink(
        data.email,
        data.full_name,
      );
    }

    if (newUser.type === 'customer') {
      const stripeCustomer = await this.paymentsService.createStripeCustomer(
        newUser.full_name,
        newUser.email,
        newUser.type,
      );

      newUser.stripe_customer_id = stripeCustomer.id;
    }

    await this.userRepo.save(newUser);

    await this.profileService.create(newUser.user_id, {
      profile_picture: payload.profile_picture,
    });

    done(null, user);
    return newUser;
  }

  async validateUser(payload: LoginInput): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: payload.email },
      relations: {
        profile: {
          salons: true,
        },
      },
    });
    if (!user) {
      throw new BadRequestException(['Usuario o contraseña incorrectas']);
    }

    const validatePass = await bcrypt.compare(payload.password, user.password);

    if (!payload.password || validatePass === false) {
      throw new BadRequestException(['Usuario o contraseña incorrectas']);
    }

    return user;
  }

  async jwtLogin(payload: LoginInput) {
    const user = await this.validateUser(payload);

    const _payload = {
      id: user.user_id,
    };

    return {
      access_token: payload.remember_me
        ? this.jwtService.sign(_payload, { expiresIn: '60d' })
        : this.jwtService.sign(_payload, { expiresIn: '4h' }),
      user: user,
    };
  }

  async oauthLogin(req: Request, remember?: boolean) {
    const _user = await req.user;
    const user = await this.validateOAuthUser(_user);

    if (!user) {
      throw new BadRequestException(['No se entregó el usuario']);
    }

    const _payload = {
      id: user.user_id,
    };

    return {
      access_token: remember
        ? this.jwtService.sign(_payload, { expiresIn: '60d' })
        : this.jwtService.sign(_payload, { expiresIn: '4h' }),
      user: user,
    };
  }
}
