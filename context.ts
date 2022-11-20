import { User } from './loaders/user.js';

export interface Context {
  token: string;
  models: {
    User: User;
  };
}
