import jwt from 'jsonwebtoken';
import { Signer } from '../entities/Signer';
import { IToken } from '../entities/Token';

export class JWTSigner implements Signer {
  constructor() {}
  signToken(token: Partial<IToken>, key: string): string {
    try {
      return jwt.sign(token, key);
    } catch (error) {
      throw error;
    }
  }
  verifyToken(token: string, key: string): boolean {
    try {
      const payload = jwt.verify(token, key);
      return payload ? true : false;
    } catch (error) {
      throw error;
    }
  }
}
