import { IAuthorization } from './Authorization';

export interface ISession {
  sessionId: string;
  userId: string;
  permissions: IAuthorization;
  created: number;
  expires: number;
}
