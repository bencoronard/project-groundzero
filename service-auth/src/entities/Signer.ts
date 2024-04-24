import { IToken } from './Token';

export interface Signer {
  signToken(token: Partial<IToken>, key: string): string;
  verifyToken(token: string, key: string): boolean;
}
