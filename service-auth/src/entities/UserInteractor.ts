import { IResponseHTTP } from '../shared/ResponseHTTP';

export interface UserInteractor {
  createUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>;
  authenticateUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>;
  authorizeUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>;
}
