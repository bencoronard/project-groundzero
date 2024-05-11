import { IAuthorization } from './Authorization';

export interface UserManagement {
  issueAccessToken(username: string, permission: string): string;
  issueRefreshToken(AccessToken: string): string;
  generateKey(
    username: string,
    password: string,
    permission: string,
    session: number,
    serverKey: string
  ): string;
}

export interface AccessToken {
  scope: string;
  iat: number;
  exp: number;
}
export interface RefreshToken {}

export interface User {
  username: string;
  password: string;
  permission: string;
  session: number;
}
