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
    try {
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      const parsedCredentials: Identity = await User.parseCredentials(
        parsedBody.credentials
      );
      const checkExisting: Payload = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'GET' },
        { identifier: parsedCredentials.identifier, limit: 1 }
      );
      if (checkExisting.isError || checkExisting.data.length) {
        throw checkExisting.isError
          ? new Error('Error checking user record')
          : new Error('User already exists');
      }
      // implement encrypt passCode here before storing
      const newUser = {
        ...parsedCredentials,
        accessLevel: 'user',
      };
      const operationResult: Payload = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'POST' },
        [newUser]
      );
      if (operationResult.isError) {
        throw new Error('Unable to create new user');
      }
      const response: ResponseHTTP = {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: 'New user created',
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async authenticateUser(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      const parsedCredentials: Identity = await User.parseCredentials(
        parsedBody.credentials
      );
      // implement encrypt passCode here before querying
      const packet: {
        match: Identity;
        update: { session: string };
      } = {
        match: parsedCredentials,
        update: { session: 'token' },
      };
      const route = { url: this.baseURL, method: 'PUT' };
      const operationResult: Payload = await this.dispatcher.dispatch(
        route,
        packet
      );
      if (operationResult.isError) {
        throw new Error('Error authenticating user');
      }
      const response: ResponseHTTP = {
        statusCode: 202,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: 'IdToken',
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async authorizeUser(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: 'AccessToken',
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
