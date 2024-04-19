import { Identity } from './Identity';

export interface IUser {
  credentials: Identity;
  accessLevel: string;
}
