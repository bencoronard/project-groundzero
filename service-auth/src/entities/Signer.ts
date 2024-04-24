export interface Signer {
  signToken(payload: any, key: string): string;
  verifyToken(token: string, key: string): boolean;
}
