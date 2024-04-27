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
    // Base URL
    this.baseURL = host;
    // Injected Dispatcher
    this.dispatcher = injectedDispatcher;
    // Injected Cipher
    this.cipher = injectedCipher;
    // Injected Hasher
    this.hasher = injectedHasher;
    // Injected Signer
    this.signer = injectedSigner;
    // Public key
    this.publicKey = publicKey;
    // Private key
    this.privateKey = privateKey;
  }

  async createUser(parsedBody: { [key: string]: any }): Promise<ResponseHTTP> {
    try {
      // Check missing inputs
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      // Parse input credentials
      const parsedCredentials: Identity = await User.parseCredentials(
        parsedBody.credentials
      );
      // Check if user already exists
      const checkExisting: ParcelUniversal = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'GET' },
        { identifier: parsedCredentials.identifier, limit: 1 }
      );
      // Check operation result
      if (checkExisting.isError || checkExisting.payload.length) {
        throw checkExisting.isError
          ? new Error('Error checking user record')
          : new Error('User already exists');
      }
      // Hash passphrase
      parsedCredentials.passphrase = await this.hasher.hash(
        parsedCredentials.passphrase
      );
      // Construct new user record
      const newUser = {
        ...parsedCredentials,
        accessLevel: 'user',
      };
      // Send user record to database to store
      const operationResult: ParcelUniversal = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'POST' },
        [newUser]
      );
      // Check operation result
      if (operationResult.isError) {
        throw new Error('Unable to create new user');
      }
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: 'New user created',
        }),
      };
      // Return successful response
      return response;
    } catch (error) {
      // Operation failed
      throw new Error('Error creating new user: ' + (error as Error).message);
    }
  }

  async authenticateUser(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Check missing inputs
      if (!parsedBody.credentials) {
        throw new Error('Missing inputs');
      }
      // Parse input credentials
      const parsedCredentials: Identity = await User.parseCredentials(
        parsedBody.credentials
      );
      // Hash passphrase
      parsedCredentials.passphrase = await this.hasher.hash(
        parsedCredentials.passphrase
      );
      // Create request parcel to send to database
      const packet = {
        match: parsedCredentials,
        update: { session: 'token' },
      };
      // Create request route
      const route = { url: this.baseURL, method: 'PUT' };
      // Send parcel to database
      const operationResult: ParcelUniversal = await this.dispatcher.dispatch(
        route,
        packet
      );
      // Check operation result
      if (operationResult.isError || !operationResult.payload) {
        throw operationResult.isError
          ? new Error('Error authenticating user')
          : new Error('Incorrect user credentials');
      }

      // Todo: extract identifier and authorization as well as duration of the token
      const accessToken: string = this.signer.signToken(
        operationResult.payload,
        this.privateKey
      );
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 202,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: accessToken,
        }),
      };
      // Return successful response
      return response;
    } catch (error) {
      // Operation failed
      throw new Error('Error authenticating user: ' + (error as Error).message);
    }
  }

  async authorizeUser(parsedHeader: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Check missing inputs
      if (!parsedHeader.bearerToken) {
        throw new Error('Missing Access Token');
      }
      // Verify token
      const operationResult: ParcelUniversal = this.signer.verifyToken(
        parsedHeader.bearerToken,
        this.publicKey
      );
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          data: operationResult.payload,
        }),
      };
      // Return successful response
      return response;
    } catch (error) {
      // Operation failed
      throw new Error('Error authorizing user: ' + (error as Error).message);
    }
  }
}
