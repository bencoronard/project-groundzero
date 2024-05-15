export class StorageRedis {
  private client: number;
  constructor(config: { uri: string }) {
    this.client = 4;
  }
}
