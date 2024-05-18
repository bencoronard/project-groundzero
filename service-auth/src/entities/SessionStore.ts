import { ISession } from './Session';

export interface SessionStore {
  createSession(sessionData: ISession): Promise<boolean>;
  terminateSession(sessionId: string): Promise<boolean>;
  verifySession(sessionId: string): Promise<Partial<ISession> | null>;
  closeConnection(): Promise<void>;
}
