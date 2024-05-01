export interface Cipher {
  generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;
  encryptSymmetric(plainText: string, key: string): Promise<string>;
  decryptSymmetric(cipherText: string, key: string): Promise<string>;
  encryptAsymmetric(plainText: string, publicKey: string): Promise<string>;
  decryptAsymmetric(cipherText: string, privateKey: string): Promise<string>;
}
