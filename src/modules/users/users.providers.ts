import { DATA_SOURCE, USER_REPOSITORY } from 'src/common/constants';
import { DataSource } from 'typeorm';
import User from './user.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
