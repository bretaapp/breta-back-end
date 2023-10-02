import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql';

import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Service } from 'src/modules/services/entities/service.entity';

import GraphQLJSON from 'graphql-type-json';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rating } from 'src/modules/rating/entities/rating.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { Appointment } from 'src/modules/appointment/entities/appointment.entity';
import { Roles } from 'src/modules/role/entities/role.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';

@Entity({ name: 'salons' })
@ObjectType()
export class Salon {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  salon_id: number;

  @Field()
  @Index()
  @Column('varchar')
  salon_name: string;

  @Field()
  @Column('varchar')
  email: string;

  @Field()
  @Column('varchar')
  cellphone: string;

  @Field()
  @Column('text', {
    default:
      'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
  })
  main_picture: string;

  @Field()
  @Column('text', {
    default: 'https://www.insights.com/media/1042/placeholder2.jpg',
  })
  wallpaper: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @Column('json', { nullable: true })
  image_gallery: object[];

  @Field()
  @Column('text')
  description: string;

  @Field(() => [GraphQLJSON])
  @Column('jsonb')
  schedule: object[];

  @Field(() => Float)
  @Column('float', { default: 1 })
  size: number;

  @Field(() => Address, { nullable: true })
  @OneToOne(() => Address, (address) => address.salon)
  @JoinColumn({ name: 'address' })
  address: Address;

  @Field(() => [Service], { nullable: true })
  @OneToMany(() => Service, (service) => service.salon, { cascade: true })
  services: Service[];

  @Field(() => Profile)
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'owner' })
  owner: Profile;

  @Field(() => [Rating], { nullable: true })
  @OneToMany(() => Rating, (rating) => rating.salon, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: Rating[];

  @Field(() => [Profile], { nullable: true })
  @ManyToMany(() => Profile, (profile) => profile.has_purchased_in, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'customers' })
  customers: Profile[];

  @Field(() => [Appointment])
  @OneToMany(() => Appointment, (appointment) => appointment.salon, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  appointments: Appointment[];

  @Field(() => [Employee])
  @OneToMany(() => Employee, (employee) => employee.salon, {
    onDelete: 'CASCADE',
  })
  employee: Employee[];

  @Field(() => [Roles])
  @OneToMany(() => Roles, (roles) => roles.salon, { onDelete: 'CASCADE' })
  roles: Roles[];

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
