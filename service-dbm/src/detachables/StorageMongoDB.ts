import * as mongo from 'mongodb';
import { RecordRepository } from '../entities/RecordRepository';
import { IRecord } from '../entities/Record';

export class StorageMongoDB implements RecordRepository {
  private client: mongo.MongoClient;
  private database: string;
  private collection: mongo.Collection<IRecord>;

  constructor(config: { uri: string; database: string; collection: string }) {
    try {
      // Create MongoDB client connection
      this.client = new mongo.MongoClient(config.uri);
      // Connect MongoDB client
      this.client.connect();
      // Default schema
      this.database = config.database;
      // Default collection
      this.collection = this.client
        .db(this.database)
        .collection(config.collection);
    } catch (error) {
      // MongoDB database connection failed
      throw error;
    }
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    try {
      // Send query to MongoDB service
      const result = await this.collection.insertMany(recordsToInsert);
      // Return number of records created
      return result.insertedCount ?? 0;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to create new records');
    }
  }

  async readEntries(
    matchCriteria: Partial<IRecord>,
    matchLimit: number,
    matchOffset: number
  ): Promise<IRecord[]> {
    try {
      // Send query to MongoDB service
      const result = await this.collection
        .find(matchCriteria)
        .limit(matchLimit)
        .skip(matchOffset)
        .toArray();
      // Return retrieved records
      return result;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to retrieve records');
    }
  }

  async updateEntries(
    matchCriteria: Partial<IRecord>,
    updateCriteria: Partial<IRecord>
  ): Promise<number> {
    try {
      // Send query to MongoDB service
      const result = await this.collection.updateMany(matchCriteria, {
        $set: updateCriteria,
      });
      // Return number of records updated
      return result.modifiedCount ?? 0;
    } catch {
      // An error occurred during execution
      throw new Error('Database unable to update records');
    }
  }

  async deleteEntries(matchCriteria: Partial<IRecord>): Promise<number> {
    try {
      // Send query to MongoDB service
      const result = await this.collection.deleteMany(matchCriteria);
      // Return number of records deleted
      return result.deletedCount ?? 0;
    } catch (error) {
      // An error occurred during execution
      throw new Error('Database unable to delete records');
    }
  }

  async closeConnection(): Promise<void> {
    try {
      // Check if current client connection is active
      if (this.client) {
        // End current MongoDB client connection
        await this.client.close();
      }
    } catch (error) {
      // MongoDB client connection termination failed
      throw error;
    }
  }
}
