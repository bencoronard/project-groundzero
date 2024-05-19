import * as redis from 'redis';
import { CacheStorage } from '../shared/CacheStorage';
import { Parcel, IParcel } from '../shared/Parcel';

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

  async set(key: string, value: string, ttl?: number): Promise<IParcel> {
    // Initialize response
    const response: Parcel = new Parcel();
    try {
      // Perform Redis set operation
      const operationResult = await this.client.set(
        key,
        value,
        ttl
          ? {
              EX: ttl,
            }
          : undefined
      );
      // Set operation result to response
      response.setPayload(operationResult);
    } catch {
      // Set error response
      response
        .setError(true)
        .setDesc('Error message')
        .setPayload('Unable to create new entry');
    }
    // Send response
    return response.pack();
  }

  async get(key: string): Promise<IParcel> {
    // Initialize response
    const response: Parcel = new Parcel();
    try {
      // Perform Redis get operation
      const operationResult = await this.client.get(key);
      // Set operation result to response
      response.setPayload(operationResult);
    } catch {
      // Set error response
      response
        .setError(true)
        .setDesc('Error message')
        .setPayload('Unable to get entry');
    }
    // Send response
    return response.pack();
  }

  async delete(key: string): Promise<IParcel> {
    // Initialize response
    const response: Parcel = new Parcel();
    try {
      // Perform Redis delete operation
      const operationResult = await this.client.del(key);
      // Set operation result to response
      response.setPayload(operationResult);
    } catch {
      // Set error response
      response
        .setError(true)
        .setDesc('Error message')
        .setPayload('Unable to delete entry');
    }
    // Send response
    return response.pack();
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
