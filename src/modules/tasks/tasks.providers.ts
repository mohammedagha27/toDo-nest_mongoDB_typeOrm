import { DATA_SOURCE, TASK_REPOSITORY } from 'src/common/constants';
import { DataSource } from 'typeorm';
import { Task } from './task.entity';

export const tasksProviders = [
  {
    provide: TASK_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
    inject: [DATA_SOURCE],
  },
];
