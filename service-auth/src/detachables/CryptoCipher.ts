import crypto from 'crypto';
import { Cipher } from '../entities/Cipher';

export class CryptoCipher implements Cipher {
  private binEncoding: BufferEncoding;
  private charEncoding: BufferEncoding;
  private symmAlgorithm: string;
  private sep: string;

  constructor() {
    // Default binary encoding
    this.binEncoding = 'base64';
    // Default character encoding
    this.charEncoding = 'utf8';
    // Default symmetric encrypting algorithm
    this.symmAlgorithm = 'aes-256-cbc';
    // Default separator for symmetric encryption (IV + sep + encryptedData)
    this.sep = ':';
  }

  async generateKey(): Promise<string> {
    try {
      // Generate symmetric key (256-bit)
      const key = crypto.randomBytes(32).toString(this.binEncoding);
      // Return key pair
      return key;
    } catch (error) {
      // Key generation failed
      throw error;
    }
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      // Generate public-private key pair
      const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      // Return key pair
      return { publicKey: keys.publicKey, privateKey: keys.privateKey };
    } catch (error) {
      // Key pair generation failed
      throw error;
    }
  }

  async encryptSymmetric(plainText: string, key: string): Promise<string> {
    try {
      // Generate a random Initialization Vector (128bit)
      const iv = crypto.randomBytes(16);
      // Create AES cipher with key and IV
      const cipher = crypto.createCipheriv(
        this.symmAlgorithm,
        Buffer.from(key, this.binEncoding),
        iv
      );
      // Initialize encryption task
      let encrypted = cipher.update(
        plainText,
        this.charEncoding,
        this.binEncoding
      );
      // Encrypt chunks of data and append to result
      encrypted += cipher.final(this.binEncoding);
      // Combine IV and encrypted data
      const combined = iv.toString(this.binEncoding) + this.sep + encrypted;
      // Return symmetrically encrypted text
      return combined;
    } catch (error) {
      // Text encryption failed
      throw new Error('Module unable to symmetrically encrypt input');
    }
  }

  async decryptSymmetric(cipherText: string, key: string): Promise<string> {
    try {
      // Split IV and encrypted data
      const parts = cipherText.split(this.sep);
      // Extract IV from encryption
      const iv = Buffer.from(parts[0], this.binEncoding);
      // Extract encrypted data
      const encryptedData = parts[1];
      // Create AES decipher with key and extracted IV
      const decipher = crypto.createDecipheriv(
        this.symmAlgorithm,
        Buffer.from(key, this.binEncoding),
        iv
      );
      // Initialize decryption task
      let decrypted = decipher.update(
        encryptedData,
        this.binEncoding,
        this.charEncoding
      );
      // Decrypt chunks of data and append to result
      decrypted += decipher.final(this.charEncoding);
      // Return decrypted symmetrically encrypted text
      return decrypted;
    } catch (error) {
      // Text decryption failed
      throw new Error('Module unable to symmetrically decrypt input');
    }
  }

  async encryptAsymmetric(
    plainText: string,
    publicKey: string
  ): Promise<string> {
    try {
      // Encrypt the input text using RSA public key
      const encrypted = crypto.publicEncrypt(
        publicKey,
        Buffer.from(plainText, this.charEncoding)
      );
      // Return encrypted binary string as base64 encoded text
      return encrypted.toString(this.binEncoding);
    } catch (error) {
      // Text encryption failed
      throw new Error('Module unable to encrypt input');
    }
  }

  async decryptAsymmetric(
    cipherText: string,
    privateKey: string
  ): Promise<string> {
    try {
      // Decrypt the encrypted data using RSA private key
      const decrypted = crypto.privateDecrypt(
        privateKey,
        Buffer.from(cipherText, this.binEncoding)
      );
      // Return decrypted binary string as UTF-8 encoded text
      return decrypted.toString(this.charEncoding);
    } catch (error) {
      // Text decryption failed
      throw new Error('Module unable to decrypt input');
    }
  }
}
