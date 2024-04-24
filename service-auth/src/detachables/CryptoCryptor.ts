import crypto from 'crypto';
import { Cryptor } from '../entities/Cryptor';

export class CryptoCryptor implements Cryptor {
  constructor() {}

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    return { publicKey: 'abc', privateKey: 'def' };
  }

  async encryptText(plainText: string): Promise<string> {
    return 'abc';
  }

  async decryptText(cipherText: string): Promise<string> {
    return 'def';
  }
}
