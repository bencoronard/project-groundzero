import { IParcel } from '../shared/Parcel';
import { IToken } from './Token';

export interface Signer {
  signToken(payload: any, key: string): string;
  verifyToken(token: string, key: string): IToken;
}
