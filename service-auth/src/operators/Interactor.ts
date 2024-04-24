import { Dispatcher } from '../entities/Dispatcher';
import { Identity, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { Payload } from '../shared/Payload';
import { Hasher } from '../entities/Hasher';

export class Interactor implements UserInteractor {
  private dispatcher: Dispatcher;
  private baseURL: string;
  private hasher: Hasher;

  constructor(
    injectedDispatcher: Dispatcher,
    injectedHasher: Hasher,
    host: string
  ) {
    this.dispatcher = injectedDispatcher;
    this.hasher = injectedHasher;
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
      parsedCredentials.passphrase = await this.hasher.hash(
        parsedCredentials.passphrase
      );
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
      parsedCredentials.passphrase = await this.hasher.hash(
        parsedCredentials.passphrase
      );
      const packet = {
        match: parsedCredentials,
        update: { session: 'token' },
      };
      const route = { url: this.baseURL, method: 'PUT' };
      const operationResult: Payload = await this.dispatcher.dispatch(
        route,
        packet
      );
      if (operationResult.isError || !operationResult.data) {
        throw operationResult.isError
          ? new Error('Error authenticating user')
          : new Error('Incorrect user credentials');
      }

      const accessToken: void = await Promise.resolve();

      const response: ResponseHTTP = {
        statusCode: 202,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: accessToken,
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async authorizeUser(parsedHeader: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      if (!parsedHeader.bearerToken) {
        throw new Error('Missing Access Token');
      }
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: 'Authorized',
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
