import { IToken } from './Token';
export interface TokenInteractor {
  issueToken(credentials: { [key: string]: any }): IToken;
  renewToken(credentials: { [key: string]: any }): IToken;
}
