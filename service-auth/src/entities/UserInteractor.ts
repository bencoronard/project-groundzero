import { Identity } from './Identity';
import { ResponseHTTP } from './ResponseHTTP';

export interface UserInteractor {
  createUser(credentials: Identity): Promise<ResponseHTTP>;
  authenticateUser(credentials: Identity): Promise<ResponseHTTP>;
  authorizeUser(token: string): Promise<ResponseHTTP>;
}
