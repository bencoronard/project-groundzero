export interface CacheStorage {
  set(key: string, value: string, ttl?: number): Promise<boolean>;
  get(key: string): Promise<string>;
  delete(key: string): Promise<boolean>;
  closeConnection(): Promise<void>;
}
