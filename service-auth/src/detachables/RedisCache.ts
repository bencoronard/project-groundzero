import * as redis from 'redis';
import { CacheStorage } from '../shared/CacheStorage';

export class RedisCache implements CacheStorage {
  private client: redis.RedisClientType;

  constructor(config: { [key: string]: any }) {
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

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      // Perform Redis set operation
      return (await this.client.set(key, value, ttl ? { EX: ttl } : undefined))
        ? true
        : false;
    } catch {
      // An error occurred during execution
      throw new Error('Cache unable to create new entry');
    }
  }

  async get(key: string): Promise<string> {
    try {
      // Perform Redis get operation
      return (await this.client.get(key)) ?? '';
    } catch {
      // An error occurred during execution
      throw new Error('Cache unable to retrieve entry');
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      // Perform Redis delete operation // 1: key existed, 0: key didn't exist
      return (await this.client.del(key)) ? true : false;
    } catch {
      // An error occurred during execution
      throw new Error('Cache unable to delete entry');
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
