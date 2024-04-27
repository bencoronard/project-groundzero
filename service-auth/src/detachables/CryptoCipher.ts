import crypto from 'crypto';
import { Cipher } from '../entities/Cipher';

export class CryptoCipher implements Cipher {
  constructor() {}

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      // Generate public-private key pair
      const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      // Return key pair
      return keys;
    } catch (error) {
      // Key pair generation failed
      throw error;
    }
  }

  async encryptText(plainText: string, key: string): Promise<string> {
    try {
      // Create binary string from input text
      const buffer = Buffer.from(plainText, 'utf-8');
      // Encrypt binary string
      const encrypted = crypto.publicEncrypt(key, buffer);
      // Return encrypted binary string as text
      return encrypted.toString('base64');
    } catch {
      // Text encryption failed
      throw new Error('Module unable to encrypt input');
    }
  }

  async decryptText(cipherText: string, key: string): Promise<string> {
    try {
      // Create binary string from input text
      const buffer = Buffer.from(cipherText, 'base64');
      // Decrypt binary string
      const decrypted = crypto.privateDecrypt(key, buffer);
      // Return decrypted binary string as text
      return decrypted.toString('utf-8');
    } catch {
      // Text decryption failed
      throw new Error('Module unable to decrypt input');
    }
  }
}
