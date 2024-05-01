import crypto from 'crypto';

class SymmetricCryptoManager {
  private key: Buffer;
  private algorithm: string;

  constructor() {
    this.key = crypto.randomBytes(32); // Generate a 256-bit key
    this.algorithm = 'aes-256-cbc';
  }

  encrypt(data: string): string {
    const iv = crypto.randomBytes(16); // Generate initialization vector
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
  }

  decrypt(encryptedData: string): string {
    const [ivString, encryptedText] = encryptedData.split(':');
    const iv = Buffer.from(ivString, 'base64');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

// Example usage
const cryptoManager = new SymmetricCryptoManager();
const originalData = 'Hello, this is a secret message!';
const encryptedData = cryptoManager.encrypt(originalData);
console.log('Encrypted Data:', encryptedData);

const decryptedData = cryptoManager.decrypt(encryptedData);
console.log('Decrypted Data:', decryptedData);
