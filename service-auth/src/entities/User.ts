export interface Identity {
  identifier: string; // i.e. username
  passphrase: string; // i.e. password
}

export interface IUser {
  credentials: Identity;
  accessLevel: string;
}

export class User {
  static async parseCredentials(input: {
    [key: string]: string;
  }): Promise<Identity> {
    try {
      // Initialize empty credential object
      const parsedCredentials: Identity = { identifier: '', passphrase: '' };
      // Check for missing inputs
      if (input.identifier && input.passphrase) {
        // Parse input identifier
        parsedCredentials.identifier = input.identifier.toString();
        // Parse input passphrase
        parsedCredentials.passphrase = input.passphrase.toString();
      } else {
        // Missing one or more input data
        throw new Error('Incomplete input credentials');
      }
      // Return parsed credentials
      return parsedCredentials;
    } catch (error) {
      // Propagate errors thrown during credential parsing
      throw error;
    }
  }
}
