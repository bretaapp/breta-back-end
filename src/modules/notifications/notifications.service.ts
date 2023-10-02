import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Profile } from '../profile/entities/profile.entity';
import { Notification } from './entities/notification.entity';

import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async create(
    profile_id: string,
    createNotificationInput: CreateNotificationInput,
  ) {
    const newNotification = this.notificationRepo.create(
      createNotificationInput,
    );

    const profile = await this.profileRepo.findOneBy({ profile_id });
    if (!profile) throw new BadRequestException(['Perfil invalido']);

    newNotification.profile = profile;

    return this.notificationRepo.save(newNotification);
  }

  async findAll() {
    const notifications = await this.notificationRepo.find();

    if (!notifications) {
      throw new NotFoundException(['No se encontraron notificaciones']);
    }

    return notifications;
  }

  async findOne(notification_id: number) {
    const notification = await this.notificationRepo.findOne({
      where: { notification_id },
    });

    if (!notification) {
      throw new NotFoundException(['No se encontró la notificación']);
    }

    return notification;
  }

  async update(
    notification_id: number,
    updateNotificationInput: UpdateNotificationInput,
  ) {
    const notification = await this.notificationRepo.findOneBy({
      notification_id,
    });

    if (!notification) {
      throw new BadRequestException(['Notificación incorrecta']);
    }

    this.notificationRepo.merge(notification, updateNotificationInput);

    return this.notificationRepo.save(notification);
  }

  async remove(notification_id: number) {
    const notification = await this.notificationRepo.findOneBy({
      notification_id,
    });

    if (!notification) {
      throw new BadRequestException(['Notificación incorrecta']);
    }

    return this.notificationRepo.delete(notification_id);
  }
}
