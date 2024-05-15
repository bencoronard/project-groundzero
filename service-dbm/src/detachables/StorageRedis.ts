import redis from 'redis';
import { RecordRepository } from '../entities/RecordRepository';
import { IRecord } from '../entities/Record';

export class StorageRedis implements RecordRepository {
  private client: redis.RedisClientType;

  constructor() {
    try {
      // Create Redis client connection
      this.client = redis.createClient();
    } catch (error) {
      // Redis connection failed
      throw error;
    }
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    try {
      // Send query to Redis service
      const result = await this.client.set('session', '111');
      // Return number of records created
      return result;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to create new records');
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
