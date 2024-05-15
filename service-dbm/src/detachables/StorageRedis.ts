import redis from 'redis';

export class StorageRedis {
  private client: redis.RedisClientType;

  constructor(config: { uri: string }) {
    this.client = redis.createClient();
  }
}
