import { Dispatcher } from '../entities/Dispatcher';
import { IUser } from '../entities/User';
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

  async createUser(credentials: Identity): Promise<ResponseHTTP> {
    try {
      const route = { url: this.path, method: 'POST' };
      const newUser: IUser = { credentials, accessLevel: 'user' };
      const status = await this.dispatcher.dispatch(route, newUser);
      return null;
    } catch (error) {
      throw error;
    }
  }
}
