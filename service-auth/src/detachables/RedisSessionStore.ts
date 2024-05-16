import redis from 'redis';
import { SessionStore } from '../entities/SessionStore';
import { ISession } from '../entities/Session';

export class RedisSessionStore implements SessionStore {
  private client: redis.RedisClientType;

  constructor(config: { url: string }) {
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

  async createSession(sessionData: ISession): Promise<void> {
    try {
      const insert = JSON.stringify({
        userId: sessionData.userId,
        permissions: sessionData.permissions,
        created: sessionData.created,
      });
      const ttl = Math.floor((sessionData.expires - Date.now()) / 1000);
      await this.client.set(sessionData.sessionId, insert, { EX: ttl });
    } catch {
      // An error occurred during execution
      throw new Error('Unable to create new session');
    }
  }

  async verifySession(sessionId: string): Promise<void> {
    try {
    } catch {
      // An error occurred during execution
      throw new Error('Unable to verify session');
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
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
