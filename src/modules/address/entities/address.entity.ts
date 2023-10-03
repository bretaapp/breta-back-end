import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Salon } from 'src/modules/salon/entities/salon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'addresses' })
@ObjectType()
export class Address {
  @Field()
  @PrimaryGeneratedColumn()
  address_id: number;

  @Field()
  @Column('varchar')
  city: string;

  @Field()
  @Column('varchar', { default: 'México' })
  country: string;

  @Field()
  @Column('varchar')
  street: string;

  @Field()
  @Column('int2')
  postal_code: number;

  @Field()
  @Column('int2')
  exterior_number: number;

  @Field()
  @Column('int2')
  interior_number: number;

  @Field(() => Salon)
  @OneToOne(() => Salon, (salon) => salon.address)
  salon: Salon;

  @Field()
  @Column('boolean', { default: false })
  is_auto_generated: boolean;

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
