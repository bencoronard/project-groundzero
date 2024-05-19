import * as redis from 'redis';
import { SessionStore } from '../entities/SessionStore';
import { ISession } from '../entities/Session';

export class RedisSessionStore implements SessionStore {
  private client: redis.RedisClientType;

  constructor(config: any) {
    try {
      // Create Redis client connection
      this.client = redis.createClient(config);
      // Handling errors in Redis client
      this.client.on('error', (error) => {
        console.error('Redis Client Error: ', error);
      });
      // Connect to Redis client
      this.client.connect();
    } catch (error) {
      // Redis connection failed
      throw error;
    }
  }

  async createSession(sessionData: ISession): Promise<boolean> {
    try {
      // Extract data to store in a session
      const session = {
        userId: sessionData.userId,
        permissions: sessionData.permissions,
        created: sessionData.created,
      };
      // Compute session Time-To-Live in seconds
      const sessionDuration = Math.floor(
        (sessionData.expires - Date.now()) / 1000
      );
      // Store session
      await this.client.set(sessionData.sessionId, JSON.stringify(session), {
        EX: sessionDuration,
      });
      // Return successful operation
      return true;
    } catch {
      // An error occurred during execution
      throw new Error('Unable to create new session');
    }
  }

  async verifySession(sessionId: string): Promise<Partial<ISession> | null> {
    try {
      // Retrieve existing session
      const retrievedData = await this.client.get(sessionId);
      // Return session data
      return retrievedData ? JSON.parse(retrievedData) : null;
    } catch {
      // An error occurred during execution
      throw new Error('Unable to verify session');
    }
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      // Delete existing session
      await this.client.del(sessionId);
      // Return successful operation
      return true;
    } catch {
      // An error occurred during execution
      throw new Error('Unable to terminate session');
    }
  }

  async closeConnection(): Promise<void> {
    try {
      // Check if current client connection is active
      if (this.client) {
        // End current Redis client connection
        await this.client.quit();
      }
    } catch (error) {
      // Redis client connection termination failed
      throw error;
    }
  }
}
