export interface IToken {
  header: { type: string; hash: string };
  payload: {
    userIdentity: string;
    issued: number;
    expires: number;
    access: any;
  };
  signature: string;
}
