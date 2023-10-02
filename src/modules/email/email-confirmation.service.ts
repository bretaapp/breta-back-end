import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import VerificationTokenPayload from './interfaces/verificationTokenPayload.interface';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly mailerService: MailerService,
  ) {}

  public sendVerificationLink(email: string, name: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const text = `Welcome to Breta. To confirm the email address, click here: ${url}`;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Confirmacion de correo electronico',
      template: 'confirm-email',
      context: {
        name: name,
        token: token,
      },
    });
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(['Email confirmation token expired']);
      }
      throw new BadRequestException(['Bad confirmation token']);
    }
  }
}
