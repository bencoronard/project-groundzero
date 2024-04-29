import { Dispatcher } from '../shared/Dispatcher';
import { IUser, Identity, User } from '../entities/User';
import { UserInteractor } from '../entities/UserInteractor';
import { IResponseHTTP, ResponseHTTP } from '../shared/ResponseHTTP';
import { IParcel } from '../shared/Parcel';
import { Hasher } from '../entities/Hasher';
import { Signer } from '../entities/Signer';
import { Authorization } from '../entities/Authorization';
import { IToken } from '../entities/Token';

export class Interactor implements UserInteractor {
  private baseURL: string;
  private dispatcher: Dispatcher;
  private hasher: Hasher;
  private signer: Signer;
  private publicKey: string;
  private privateKey: string;

  constructor(
    host: string,
    injectedDispatcher: Dispatcher,
    injectedHasher: Hasher,
    injectedSigner: Signer,
    publicKey: string,
    privateKey: string
  ) {
    // Base URL
    this.baseURL = host;
    // Injected Dispatcher
    this.dispatcher = injectedDispatcher;
    // Injected Hasher
    this.hasher = injectedHasher;
    // Injected Signer
    this.signer = injectedSigner;
    // Public key
    this.publicKey = publicKey;
    // Private key
    this.privateKey = privateKey;
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
      const checkExisting: IParcel = await this.dispatcher.dispatch(
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
      const operationResult: IParcel = await this.dispatcher.dispatch(
        { url: this.baseURL, method: 'POST' },
        [User.flatten(newUser)]
      );
      // Check operation result
      if (operationResult.isError) {
        throw new Error('Unable to create new user');
      }
      // Set successful response
      response
        .setStatus(201)
        .getBody()
        .setError(false)
        .setPayload('New user created');
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error creating new user: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async authenticateUser(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
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
      let operationResult: IParcel = await this.dispatcher.dispatch(
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
      // Set successful response
      response.setStatus(202).getBody().setError(false).setPayload(accessToken);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error authenticating user: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async authorizeUser(parsedHeader: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
    try {
      // Check missing inputs
      if (!parsedHeader.bearerToken) {
        throw new Error('Missing Access Token');
      }
      // Verify token
      const operationResult: IToken = this.signer.verifyToken(
        parsedHeader.bearerToken,
        this.publicKey
      );

      // Set successful response
      response
        .setStatus(202)
        .getBody()
        .setError(false)
        .setPayload(operationResult);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error authorizing user: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }
}
