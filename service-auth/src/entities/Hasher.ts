export interface Hasher {
  hash(plainText: string): Promise<string>;
  compare(cipherText1: string, cipherText2: string): Promise<boolean>;
}
