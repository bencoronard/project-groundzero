export interface Cipher {
  generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;
  encryptText(plainText: string, key: string): Promise<string>;
  decryptText(cipherText: string, key: string): Promise<string>;
}
