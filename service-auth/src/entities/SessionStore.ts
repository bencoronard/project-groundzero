import { ISession } from './Session';

export interface SessionStore {
  createSession(sessionData: ISession): Promise<void>;
  terminateSession(sessionId: string): Promise<void>;
  closeConnection(): Promise<void>;
}
