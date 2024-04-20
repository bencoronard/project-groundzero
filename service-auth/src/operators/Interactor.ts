import { Dispatcher } from '../entities/Dispatcher';
import { IUser, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { Identity } from '../entities/Identity';
import { ResponseHTTP } from '../entities/ResponseHTTP';

export class Interactor implements UserInteractor {
  private dispatcher: Dispatcher;
  private path: string;

  constructor(injectedDispatcher: Dispatcher, path: string) {
    this.dispatcher = injectedDispatcher;
    this.path = path;
  }

  async createUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP> {
    if (parsedBody.credentials) {
      try {
        const parsedCredentials: Identity = await User.parseCredentials(
          parsedBody.credentials
        );
        const newUser: IUser = {
          credentials: parsedCredentials,
          accessLevel: 'user',
        };
        const route = { url: this.path, method: 'POST' };
        const status = await this.dispatcher.dispatch(route, newUser);
        const response: ResponseHTTP = {
          statusCode: 201,
          headers: { 'Content-Type': 'text/plain' },
          body: 'New user created',
        };
        return response;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Missing inputs');
    }
  }
}
