import { IAuthorization } from './Authorization';

export interface IToken {
  user: string;
  permissions: IAuthorization;
}

export interface AccessTokenPayload {
  sub: string; // subject
  iss: string; // issuer
  aud: string; // audience
  scope: IAuthorization; // permissions
  exp: number; // expiration (UNIX timestamps)
  iat: number; // issued (UNIX timestamp)
}
export interface RefreshTokenPayload {
  sub: string; // subject
  iss: string; // issuer
  aud: string; // audience
  exp: number; // expiration (UNIX timestamps)
  iat: number; // issued (UNIX timestamp)
}

export interface Token {
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
