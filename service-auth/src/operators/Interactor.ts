import { Dispatcher } from '../entities/Dispatcher';
import { Identity, IUser, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { Payload } from '../shared/Payload';

export class Interactor implements UserInteractor {
  private dispatcher: Dispatcher;
  private baseURL: string;

  constructor(injectedDispatcher: Dispatcher, host: string) {
    this.dispatcher = injectedDispatcher;
    this.baseURL = host;
  }

  async createUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP> {
    if (parsedBody.credentials) {
      try {
        const parsedCredentials: Identity = await User.parseCredentials(
          parsedBody.credentials
        );
        const check: Payload = await this.dispatcher.dispatch(
          { url: this.baseURL, method: 'GET' },
          { identifier: parsedCredentials.identifier, limit: 1 }
        );
        if (!check.data.length) {
          const newUser = {
            ...parsedCredentials,
            accessLevel: 'user',
          };
          const operationResult: Payload = await this.dispatcher.dispatch(
            { url: this.baseURL, method: 'POST' },
            [newUser]
          );
          const response: ResponseHTTP = {
            statusCode: operationResult.data ? 201 : 400,
            headers: { 'Content-Type': 'text/plain' },
            body: operationResult.data
              ? 'New user created'
              : 'Unable to create new user',
          };
          return response;
        } else {
          throw new Error('User already exists');
        }
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Missing inputs');
    }
  }

  async authenticateUser(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    if (parsedBody.credentials) {
      try {
        const parsedCredentials: Identity = await User.parseCredentials(
          parsedBody.credentials
        );
        const packet: {
          match: { credentials: Identity };
          update: Partial<IUser>;
        } = {
          match: { credentials: parsedCredentials },
          update: { accessLevel: 'abc' },
        };
        const route = { url: this.baseURL, method: 'PUT' };
        const operationResult: Payload = await this.dispatcher.dispatch(
          route,
          packet
        );
        const response: ResponseHTTP = {
          statusCode: operationResult.data ? 200 : 400,
          headers: { 'Content-Type': 'text/plain' },
          body: operationResult.data
            ? 'Authenticated'
            : 'Unable to authenticate',
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
