import crypto from 'crypto';
import { Cipher } from '../entities/Cipher';

export class CryptoCipher implements Cipher {
  constructor() {}

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      return keys;
    } catch (error) {
      throw error;
    }
  }

  async encryptText(plainText: string, key: string): Promise<string> {
    try {
      const buffer = Buffer.from(plainText, 'utf-8');
      const encrypted = crypto.publicEncrypt(key, buffer);
      return encrypted.toString('base64');
    } catch (error) {
      throw error;
    }
  }

  async decryptText(cipherText: string, key: string): Promise<string> {
    try {
      const buffer = Buffer.from(cipherText, 'base64');
      const decrypted = crypto.privateDecrypt(key, buffer);
      return decrypted.toString('utf-8');
    } catch (error) {
      throw error;
    }
  }
}
