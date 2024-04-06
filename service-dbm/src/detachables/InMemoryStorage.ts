import { readFileSync } from 'fs';
import { IRecord } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import path from 'path';

export class InMemoryStorage implements RecordRepository {
  private storedRecords: IRecord[];
  public numEntries: number;
  constructor() {
    this.storedRecords = JSON.parse(
      readFileSync(path.join(__dirname, '..', 'agents.json'), 'utf-8')
    );
    this.numEntries = this.storedRecords.length;
  }

  async createEntries(recordsToInsert: IRecord[]): Promise<number> {
    const promises: Promise<void>[] = [];

    recordsToInsert.forEach((record) => {
      const insertPromise = new Promise<void>((resolve, reject) => {
        try {
          this.storedRecords.push(record);
          this.numEntries++;
          resolve();
        } catch {
          reject();
        }
      });
      promises.push(insertPromise);
    });

    const operationResults = await Promise.allSettled(promises);
    return operationResults.filter((result) => {
      result.status === 'fulfilled';
    }).length;
  }

  async updateEntries(
    matchCriteria: Partial<IRecord>,
    updateValues: Partial<IRecord>
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const updatedRecords: IRecord[] = [];
      try {
        let searchIndex: number = 0;
        const matchKeys = Object.keys(matchCriteria).map(
          (key) => key as keyof IRecord
        );
        const updateKeys = Object.keys(updateValues).map(
          (key) => key as keyof IRecord
        );
        while (searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: IRecord = this.storedRecords[searchIndex];
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
    matchCriteria: Partial<IRecord>,
    matchLimit: number,
    matchOffset: number
  ): Promise<IRecord[]> {
    return new Promise((resolve, reject) => {
      const retrievedRecords: IRecord[] = [];
      try {
        const matchKeys = Object.keys(matchCriteria).map(
          (key) => key as keyof IRecord
        );
        let numMatched: number = 0;
        let searchIndex: number = matchOffset;
        while (numMatched < matchLimit && searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: IRecord = this.storedRecords[searchIndex];
          matchKeys.forEach((key) => {
            matched =
              currentRecord[key] === matchCriteria[key] ? matched : false;
          });
          // const checkArray: boolean[] = matchKeys.map((key) =>
          //   currentRecord[key] === matchCriteria[key] ? true : false
          // );
          // const check: boolean = checkArray.every(Boolean);
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
    matchCriteria: Partial<IRecord>,
    matchOffset: number
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const deletedRecords: IRecord[] = [];
      try {
        let searchIndex: number = matchOffset;
        while (searchIndex < this.numEntries) {
          let matched: boolean = true;
          const currentRecord: IRecord = this.storedRecords[searchIndex];
          const matchKeys = Object.keys(matchCriteria).map(
            (key) => key as keyof IRecord
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
