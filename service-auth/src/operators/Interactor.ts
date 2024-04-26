import { Dispatcher } from '../entities/Dispatcher';
import { Identity, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { ParcelUniversal } from '../shared/ParcelUniversal';
import { Hasher } from '../entities/Hasher';
import { Signer } from '../entities/Signer';
import { Cipher } from '../entities/Cipher';

export class Interactor implements UserInteractor {
  private baseURL: string;
  private dispatcher: Dispatcher;
  private cipher: Cipher;
  private hasher: Hasher;
  private signer: Signer;
  private publicKey: string;
  private privateKey: string;

  constructor(
    host: string,
    injectedDispatcher: Dispatcher,
    injectedCipher: Cipher,
    injectedHasher: Hasher,
    injectedSigner: Signer,
    publicKey: string,
    privateKey: string
  ) {
    this.baseURL = host;
    this.dispatcher = injectedDispatcher;
    this.cipher = injectedCipher;
    this.hasher = injectedHasher;
    this.signer = injectedSigner;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  async createUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP> {
    try {
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      const parsedCredentials: Identity = await User.parseCredentials(
        parsedBody.credentials
      );
      const checkExisting: ParcelUniversal = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'GET' },
        { identifier: parsedCredentials.identifier, limit: 1 }
      );
      if (checkExisting.isError || checkExisting.payload.length) {
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
      const operationResult: ParcelUniversal = await this.dispatcher.dispatch(
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
      const operationResult: ParcelUniversal = await this.dispatcher.dispatch(
        route,
        packet
      );
      if (operationResult.isError || !operationResult.payload) {
        throw operationResult.isError
          ? new Error('Error authenticating user')
          : new Error('Incorrect user credentials');
      }

      // extract identifier and authorization as well as duration of the token
      const accessToken: string = this.signer.signToken(
        operationResult.payload,
        this.privateKey
      );

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
      const operationResult: ParcelUniversal = this.signer.verifyToken(
        parsedHeader.bearerToken,
        this.publicKey
      );
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: operationResult.payload,
        }),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
