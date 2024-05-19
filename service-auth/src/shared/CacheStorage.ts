import { IParcel } from './Parcel';

export interface CacheStorage {
  set(key: string, value: string, ttl?: number): Promise<IParcel>;
  get(key: string): Promise<IParcel>;
  delete(key: string): Promise<IParcel>;
  closeConnection(): Promise<void>;
}
