import { Dispatcher } from '../shared/Dispatcher';
import { IUser, Identity, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { ParcelUniversal } from '../shared/ParcelUniversal';
import { Hasher } from '../entities/Hasher';
import { Signer } from '../entities/Signer';
import { Cipher } from '../entities/Cipher';
import { Authorization } from '../entities/Authorization';

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
      const parsedCredentials: Identity = User.parseCredentials(
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
      const newUser: IUser = {
        credentials: parsedCredentials,
        permissions: Authorization.user(),
        lastAuthenticated: Date.now(),
      };
      // Send user record to database to store
      const operationResult: ParcelUniversal = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'POST' },
        [User.flatten(newUser)]
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
          payload: 'New user created',
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
      const parsedCredentials: Identity = User.parseCredentials(
        parsedBody.credentials
      );
      // Hash passphrase
      parsedCredentials.passphrase = await this.hasher.hash(
        parsedCredentials.passphrase
      );
      // Create request parcel to send to database
      const packet = {
        match: parsedCredentials,
        update: { lastAuthenticated: Date.now() },
      };
      // Send parcel to database
      let operationResult: ParcelUniversal = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'PUT' },
        packet
      );
      // Check operation result
      if (operationResult.isError || !operationResult.payload) {
        throw operationResult.isError
          ? new Error('Error authenticating user')
          : new Error('Incorrect user credentials');
      }
      // Fetch permissions
      operationResult = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'GET' },
        { identifier: parsedCredentials.identifier, limit: 1 }
      );
      // Construct token payload
      const payload = {
        user: parsedCredentials.identifier,
        permissions: operationResult.payload[0].permissions,
      };
      // Sign token payload
      const accessToken: string = this.signer.signToken(
        payload,
        this.privateKey
      );
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 202,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: false,
          payload: accessToken,
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
          payload: operationResult.payload,
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
