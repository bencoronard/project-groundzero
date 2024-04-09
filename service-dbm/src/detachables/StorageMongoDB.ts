import { RecordRepository } from '../entities/RecordRepository';
import { Record, IRecord } from '../entities/Record';
import * as mongo from 'mongodb';

export class StorageMongoDB implements RecordRepository {
  private client: mongo.MongoClient;
  private database: string;
  private collection: mongo.Collection<IRecord>;

  constructor(config: { uri: string; database: string; collection: string }) {
    this.client = new mongo.MongoClient(config.uri);
    this.client.connect();
    this.database = config.database;
    this.collection = this.client
      .db(this.database)
      .collection(config.collection);
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    try {
      const result = await this.collection.insertMany(recordsToInsert);
      return result.insertedCount ?? 0;
    } catch (error) {
      throw error;
    }
  }

  async readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit: number,
    matchOffset: number
  ): Promise<IRecord[]> {
    try {
      return this.collection
        .find(matchCriteria)
        .limit(matchLimit)
        .skip(matchOffset)
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async updateEntries(
    matchCriteria: Partial<IRecord>,
    updateCriteria: Partial<IRecord>
  ): Promise<number> {
    try {
      const result = await this.collection.updateMany(matchCriteria, {
        $set: updateCriteria,
      });
      return result.modifiedCount ?? 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteEntries(matchCriteria: Partial<IRecord>): Promise<number> {
    try {
      const result = await this.collection.deleteMany(matchCriteria);
      return result.deletedCount ?? 0;
    } catch (error) {
      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
      }
    } catch (error) {
      throw error;
    }
  }
}
