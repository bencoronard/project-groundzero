import { IAuthorization } from './Authorization';

export interface ISession {
  sessionId: string;
  identifier: string;
  permissions: IAuthorization;
  created: number;
  expires: number;
}
