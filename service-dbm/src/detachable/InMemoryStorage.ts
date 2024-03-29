import { readFileSync } from 'fs';
import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import path from 'path';

export class InMemoryStorage implements RecordRepository {
  private storedRecords: Record[];
  public numEntries: number;
  constructor() {
    this.storedRecords = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'agents.json'), 'utf-8')
    );
    this.numEntries = this.storedRecords.length;
  }

  async createEntries(recordsToInsert: Record[]): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const insertedRecords: Record[] = [];
      try {
        recordsToInsert.forEach((record) => {
          this.storedRecords.push(record);
          this.numEntries++;
          insertedRecords.push(record);
        });
        resolve(insertedRecords);
      } catch {
        reject(insertedRecords);
      }
    });
  }

  async updateEntries(
    matchCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const updatedRecords: Record[] = [];
      try {
        let searchIndex: number = 0;
        while (searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: Record = this.storedRecords[searchIndex];
          const matchKeys = Object.keys(matchCriteria).map(
            (key) => key as keyof Partial<Record>
          );
          const updateKeys = Object.keys(updateValues).map(
            (key) => key as keyof Partial<Record>
          );
          matchKeys.forEach((key) => {
            matched =
              currentRecord[key] === matchCriteria[key] ? matched : false;
          });
          if (matched) {
            updateKeys.forEach((key) => {
              currentRecord[key] = updateValues[key];
            });
            updatedRecords.push(currentRecord);
          }
          searchIndex++;
        }
        resolve(updatedRecords);
      } catch {
        reject(updatedRecords);
      }
    });
  }

  async readEntries(
    matchCriteria: Partial<Record>,
    matchLimit: number,
    matchOffset: number
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const retrievedRecords: Record[] = [];
      try {
        let numMatched: number = 0;
        let searchIndex: number = matchOffset;
        while (numMatched < matchLimit && searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: Record = this.storedRecords[searchIndex];
          const matchKeys = Object.keys(matchCriteria).map(
            (key) => key as keyof Partial<Record>
          );
          matchKeys.forEach((key) => {
            matched =
              currentRecord[key] === matchCriteria[key] ? matched : false;
          });
          if (matched) {
            retrievedRecords.push(currentRecord);
            numMatched++;
          }
          searchIndex++;
        }
        resolve(retrievedRecords);
      } catch {
        reject(retrievedRecords);
      }
    });
  }

  async deleteEntries(
    matchCriteria: Partial<Record>,
    matchOffset: number
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const deletedRecords: Record[] = [];
      try {
        let searchIndex: number = matchOffset;
        while (searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: Record = this.storedRecords[searchIndex];
          const matchKeys = Object.keys(matchCriteria).map(
            (key) => key as keyof Partial<Record>
          );
          matchKeys.forEach((key) => {
            matched =
              currentRecord[key] === matchCriteria[key] ? matched : false;
          });
          if (matched) {
            deletedRecords.push(currentRecord);
            this.storedRecords.splice(searchIndex, 1);
            this.numEntries--;
            searchIndex--;
          }
          searchIndex++;
        }
        resolve(deletedRecords);
      } catch {
        reject(deletedRecords);
      }
    });
  }

  showRecords(): void {
    console.log(this.storedRecords);
  }
}
