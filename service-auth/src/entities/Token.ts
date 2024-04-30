import { IAuthorization } from './Authorization';

export interface IToken {
  user: string;
  permissions: IAuthorization;
}
