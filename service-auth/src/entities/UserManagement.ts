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
  aud: string; // userId
  scope: string; // permission
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
