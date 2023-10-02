import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mail from 'nodemailer/lib/mailer';

const configService = new ConfigService();
@Injectable()
export class EmailService {
  private nodemailerTrasport: Mail;
  constructor(private readonly configService: ConfigService) {}
}
