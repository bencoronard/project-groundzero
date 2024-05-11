import { IAuthorization } from './Authorization';

export interface UserManagement {
  issueAccessToken(): string;
  issueRefreshToken(AccessToken: string): string;
  generateKey(
    username: string,
    password: string,
    permission: string,
    session: number,
    serverKey: string
  ): string;
}

export interface AccessToken {}
export interface RefreshToken {}

export interface User {
  username: string;
  password: string;
  permission: string;
  session: number;
  key: string;
}
