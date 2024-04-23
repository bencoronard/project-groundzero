// export interface Encryptor {
//   encrypt(plainText: string, key: string): Promise<string>;
//   decrypt(cipherText: string, key: string): Promise<string>;
// }

export interface Hasher {
  hash(plainText: string): Promise<string>;

  compare(cipherText1: string, cipherText2: string): Promise<boolean>;
}
