import jwt from 'jsonwebtoken';
import { Signer } from '../entities/Signer';
import { ParcelUniversal } from '../shared/ParcelUniversal';

export class JWTSigner implements Signer {
  private options: object;
  constructor() {
    this.options = { algorithm: 'RS256' };
  }
  signToken(payload: any, key: string): string {
    try {
      return jwt.sign(payload, key, this.options);
    } catch (error) {
      throw error;
    }
  }
  verifyToken(token: string, key: string): ParcelUniversal {
    try {
      const payload = jwt.verify(token, key, this.options);
      return { isError: false, payload: payload };
    } catch (error) {
      throw error;
    }
  }
}
