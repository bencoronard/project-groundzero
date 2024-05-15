import { IResponseHTTP } from '../shared/ResponseHTTP';

export interface UserInteractor {
  createUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // insert into DB
  updateUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // update DB + delete session
  deleteUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // delete from DB + delete session

  authenticateUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // create session
  authorizeUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // verify session
  deauthorizeUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>; // delete session
}
