import { IAuthorization } from './Authorization';

export interface IToken {
  user: string;
  permissions: IAuthorization;
}
// export interface IdTokenPayload {
//   sub: string; // subject
//   iss: string; // issuer
//   aud: string; // audience
//   exp: number; // expiration (UNIX timestamps)
//   iat: number; // issued (UNIX timestamp)
// }
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

export class Token {
  // static issueIdToken(): IdTokenPayload {}
  // static issueAccessToken(): AccessTokenPayload {}
}
