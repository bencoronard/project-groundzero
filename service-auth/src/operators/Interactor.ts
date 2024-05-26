import { Hash } from 'crypto';
import { Hasher } from '../entities/Hasher';
import { Signer } from '../entities/Signer';
import { UserInteractor } from '../entities/UserInteractor';
import { CacheStorage } from '../shared/CacheStorage';
import { Dispatcher } from '../shared/Dispatcher';
import { IResponseHTTP, ResponseHTTP } from '../shared/ResponseHTTP';
import { IUser, Identity, User } from '../entities/User';
import { IParcel } from '../shared/Parcel';
import { Authorization } from '../entities/Authorization';

export class Interactor implements UserInteractor {
  private uriUserDB: string;
  private keys: { public: string; private: string };
  private sessionStore: CacheStorage;
  private dispatcher: Dispatcher;
  private hasher: Hasher;
  private signer: Signer;

  constructor(
    host: string,
    keys: { public: string; private: string },
    injectedDispatcher: Dispatcher,
    injectedHasher: Hasher,
    injectedSigner: Signer,
    injectedSessionStore: CacheStorage
  ) {
    // User database route
    this.uriUserDB = host;
    // Public/Private keys
    this.keys = keys;
    // Injected Session storage
    this.sessionStore = injectedSessionStore;
    // Injected Dispatcher
    this.dispatcher = injectedDispatcher;
    // Injected Hasher
    this.hasher = injectedHasher;
    // Injected Signer
    this.signer = injectedSigner;
  }

  async createUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
    try {
      // Check missing inputs
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      // Parse input credentials
      const parsedCredentials: Identity = User.parseCredentials(
        parsedBody.credentials
      );
      // Check if user already exists
      const checkExisting: IParcel = await this.dispatcher.dispatchInternal(
        { url: this.uriUserDB, method: 'GET' },
        { identifier: parsedCredentials.identifier, limit: 1 }
      );
      // Check operation result
      if (checkExisting.isError || checkExisting.payload.length) {
        throw checkExisting.isError
          ? new Error('Error checking user record')
          : new Error('User already exists');
      }
      // Hash secretKey
      parsedCredentials.secretKey = await this.hasher.hash(
        parsedCredentials.secretKey
      );
      // Construct new user record
      const newUser: IUser = {
        userId: '',
        credentials: parsedCredentials,
        permissions: Authorization.user(),
        lastSessionId: '',
      };
      // Send user record to database for storage
      const operationResult: IParcel = await this.dispatcher.dispatchInternal(
        { url: this.uriUserDB, method: 'POST' },
        [User.flatten(newUser)]
      );
      // Check operation result
      if (operationResult.isError) {
        throw new Error('Unable to create new user');
      }
      // Set successful response
      response.setStatus(201).getBody().setPayload('New user created');
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .setStatus(400)
        .getBody()
        .setError(true)
        .setDesc('Error message')
        .setPayload('Error creating new user: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async updateUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP> {
    return new ResponseHTTP().seal();
  }

  async deleteUser(parsedBody: { [key: string]: any }): Promise<IResponseHTTP> {
    return new ResponseHTTP().seal();
  }

  async authenticateUser(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    return new ResponseHTTP().seal();
  }

  async authorizeUser(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    return new ResponseHTTP().seal();
  }

  async deauthorizeUser(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    return new ResponseHTTP().seal();
  }
}
