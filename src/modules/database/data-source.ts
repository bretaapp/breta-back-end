import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { config } from 'dotenv';
import { join } from 'path';
config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  database: configService.get('POSTGRES_DB'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  ssl: configService.get('SSL', false),
  synchronize: true,

  entities: [join('dist', '**', '*.entity.{ts,js}')],

  migrations: ['dist/migrations/*.{ts,js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
