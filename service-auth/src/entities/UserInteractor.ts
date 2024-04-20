import { ResponseHTTP } from './ResponseHTTP';

export interface UserInteractor {
  createUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP>;

  authenticateUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP>;

  authorizeUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP>;
}
