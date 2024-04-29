import { IAuthorization } from './Authorization';

export interface IToken {
  owner: string;
  permissions: IAuthorization;
}
