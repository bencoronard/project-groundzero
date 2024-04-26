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
      const parsedCredentials: Identity = { identifier: '', passphrase: '' };
      if (input.identifier && input.passphrase) {
        parsedCredentials.identifier = input.identifier.toString();
        parsedCredentials.passphrase = input.passphrase.toString();
      } else {
        throw new Error('Incomplete input credentials');
      }
      return parsedCredentials;
    } catch (error) {
      throw error;
    }
  }
}
