import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('profile_id', { type: () => ID }) profile_id: string,
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(
      profile_id,
      createNotificationInput,
    );
  }

  @Query(() => [Notification], { name: 'notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Query(() => Notification, { name: 'notification' })
  findOne(
    @Args('notification_id', { type: () => ID }) notification_id: number,
  ) {
    return this.notificationsService.findOne(notification_id);
  }

  @Mutation(() => Notification)
  updateNotification(
    @Args('notification_id') notification_id: number,
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationsService.update(
      notification_id,
      updateNotificationInput,
    );
  }

  @Mutation(() => Notification)
  removeNotification(
    @Args('notification_id', { type: () => ID }) notification_id: number,
  ) {
    return this.notificationsService.remove(notification_id);
  }
}
