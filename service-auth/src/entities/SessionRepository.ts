export interface SessionRepository {
  createSession(): void;
  terminateSession(): void;
}
