export interface Cryptor {
  generateKeyPair(): Promise<{ publicKey: string; privateKey: string }>;
}
