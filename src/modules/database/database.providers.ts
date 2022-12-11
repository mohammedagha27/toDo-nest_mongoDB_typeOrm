import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { DATABASE, DATA_SOURCE } from 'src/common/constants';
import { DataSource } from 'typeorm';
dotenv.config();
export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const dbSource = new DataSource({
        ...configService.get(DATABASE),
      });

      return dbSource.initialize();
    },
    inject: [ConfigService],
  },
];
