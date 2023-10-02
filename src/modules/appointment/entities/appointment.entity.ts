import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Service } from 'src/modules/services/entities/service.entity';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Salon } from 'src/modules/salon/entities/salon.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';

@Entity({ name: 'appointments' })
@ObjectType()
export class Appointment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @Field()
  @Column('timestamptz')
  start: Date;

  @Field()
  @Column('timestamptz')
  end: Date;

  @Field({ nullable: true })
  @Column('boolean', { default: false })
  is_active: boolean;

  @Field({ nullable: true })
  @Column('varchar', { default: 'undetermined' })
  status: 'accepted' | 'rejected' | 'undetermined';

  @Field(() => Profile)
  @ManyToOne(() => Profile, (profile) => profile.appointments)
  @JoinColumn({ name: 'subscriber' })
  subscriber: Profile;

  @Field(() => [Service])
  @ManyToMany(() => Service, (service) => service.appointments)
  services: Service[];

  @Field()
  @ManyToOne(() => Salon, (salon) => salon.appointments)
  @JoinColumn({ name: 'salon' })
  salon: Salon;

  @Field(() => [Employee])
  @ManyToMany(() => Employee, (employee) => employee.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'attended_by',
    joinColumn: {
      name: 'appointment_id',
    },
    inverseJoinColumn: {
      name: 'employee_id',
    },
  })
  attended_by: Employee[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    precision: 3,
  })
  updated_at: Date;
}
