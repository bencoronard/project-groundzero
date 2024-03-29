import { readFileSync } from 'fs';
import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import path from 'path';

export class InMemoryStorage implements RecordRepository {
  private storedRecords: Record[];
  private numRecords: number;
  constructor() {
    this.storedRecords = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'agents.json'), 'utf-8')
    );
    this.numRecords = this.storedRecords.length;
  }

  async createEntries(recordsToInsert: Record[]): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const insertedRecords: Record[] = [];
      try {
        recordsToInsert.forEach((record) => {
          this.storedRecords.push(record);
          this.numRecords++;
          insertedRecords.push(record);
        });
        resolve(insertedRecords);
      } catch {
        reject(insertedRecords);
      }
    });
  }

  async readEntries(
    matchCriteria: Partial<Record>,
    matchLimit?: number,
    matchOffset?: number
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const retrievedRecords: Record[] = [];
      try {
        const limit: number =
          matchLimit && matchLimit >= 0 && matchLimit <= this.numRecords
            ? matchLimit
            : this.numRecords;
        let numMatched: number = 0;
        let searchIndex: number =
          matchOffset && matchOffset >= 0 ? matchOffset : 0;
        while (numMatched < limit && searchIndex < this.numRecords) {
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

  async updateEntries(
    matchCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const updatedRecords: Record[] = [];
      try {
        let searchIndex: number = 0;
        while (searchIndex < this.numRecords) {
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

  async deleteEntries(
    matchCriteria: Partial<Record>,
    matchOffset?: number
  ): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const deletedRecords: Record[] = [];
      try {
        let searchIndex: number =
          matchOffset && matchOffset >= 0 ? matchOffset : 0;
        while (searchIndex < this.numRecords) {
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
            this.numRecords--;
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
