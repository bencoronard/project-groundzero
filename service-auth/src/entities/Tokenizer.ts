import { IToken } from './Token';

export interface Tokenizer {
  generateToken(): Promise<IToken>;
}
