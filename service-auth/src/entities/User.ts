export interface Identity {
  identifier: string; // i.e. username
  passCode: string; // i.e. password
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
      const parsedCredentials: Identity = { identifier: '', passCode: '' };
      if (input.identifier && input.passCode) {
        parsedCredentials.identifier = input.identifier.toString();
        parsedCredentials.passCode = input.passCode.toString();
      } else {
        throw new Error('Incomplete input credentials');
      }
      return parsedCredentials;
    } catch (error) {
      throw error;
    }
  }
}
