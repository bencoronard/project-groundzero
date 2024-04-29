import { IParcel } from '../shared/Parcel';

export interface Signer {
  signToken(payload: any, key: string): string;
  verifyToken(token: string, key: string): IParcel;
}
