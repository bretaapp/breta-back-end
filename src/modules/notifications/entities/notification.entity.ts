import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notifications' })
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column('varchar')
  message: string;

  @Field(() => [Profile])
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile' })
  profile: Profile;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
