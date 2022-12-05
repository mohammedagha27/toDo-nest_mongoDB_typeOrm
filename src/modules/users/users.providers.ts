import { User } from './user.model';

export const usersProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
