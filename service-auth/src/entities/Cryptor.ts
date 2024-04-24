export interface Cryptor {
  generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;
  encryptText(plainText: string): Promise<string>;
  decryptText(cipherText: string): Promise<string>;
}
