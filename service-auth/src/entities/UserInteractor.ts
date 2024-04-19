import { Identity } from './Identity';
import { IUser } from './User';

export interface UserInteractor {
  createUser(credentials: Identity): IUser;
  authenticateUser(credentials: Identity): IUser;
  // authorizeUser(user: IUser): string;
}
