import crypto from 'crypto';
import { Cryptor } from '../entities/Cryptor';

export class CryptoCryptor implements Cryptor {
  constructor() {}

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      let keys = { publicKey: '', privateKey: '' };
      crypto.generateKeyPair('rsa', 'pem', (err, pubKey, privKey) => {
        if (err) {
          throw err;
        }
        keys.publicKey = pubKey;
        keys.privateKey = privKey;
      });
      return keys;
    } catch (error) {
      throw error;
    }
  }

  async encryptText(plainText: string): Promise<string> {
    return 'abc';
  }

  async decryptText(cipherText: string): Promise<string> {
    return 'def';
  }
}
