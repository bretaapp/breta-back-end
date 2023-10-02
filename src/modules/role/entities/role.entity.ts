import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Salon } from 'src/modules/salon/entities/salon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
@ObjectType()
export class Roles {
  @Field()
  @PrimaryGeneratedColumn()
  role_id: number;

  @Field()
  @Column('varchar')
  role_name: string;

  @Field(() => Employee, { nullable: true })
  @OneToMany(() => Employee, (employee) => employee.role)
  employee: Employee;

  @Field(() => Salon)
  @ManyToOne(() => Salon, (salon) => salon.roles)
  salon: Salon;

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
