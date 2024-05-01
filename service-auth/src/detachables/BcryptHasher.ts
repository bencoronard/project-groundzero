import bcrypt from 'bcrypt';
import { Hasher } from '../entities/Hasher';

export class BcryptHasher implements Hasher {
  private saltRounds: number;

  constructor() {
    // Default hasing salt rounds
    this.saltRounds = 10;
  }

  async hash(plainText: string): Promise<string> {
    try {
      // Return hashed text
      return await bcrypt.hash(plainText, this.saltRounds);
    } catch {
      // Input hashing failed
      throw new Error('Module unable to hash input');
    }
  }
  async compare(plainText: string, cipherText: string): Promise<boolean> {
    try {
      // Return whether two inputs are same
      return await bcrypt.compare(plainText, cipherText);
    } catch {
      // Input comparison failed
      throw new Error('Module unable to verify hashed input');
    }
  }
}
