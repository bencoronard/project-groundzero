import { readFileSync } from 'fs';
import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import path, { resolve } from 'path';

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
          insertedRecords.push(record);
        });
        this.numRecords += insertedRecords.length;
        resolve(insertedRecords);
      } catch {
        reject(insertedRecords);
      }
    });
  }

  async readEntries(
    matchCriteria: Partial<Record>,
    matchLimit?: number | undefined,
    matchOffset?: number | undefined
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
          Object.keys(matchCriteria).forEach((key) => {
            const field = key as keyof Partial<Record>;
            matched =
              currentRecord[field] === matchCriteria[field] ? matched : false;
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

  // async readEntries(
  //   matchCriteria: Partial<Record>,
  //   matchLimit?: number | undefined,
  //   matchOffset?: number | undefined
  // ): Promise<Record[]> {
  //   const retrievedRecords: Record[] | null = this.storedRecords.filter(
  //     (record) => {
  //       let matched: boolean = true;
  //       Object.keys(matchCriteria).forEach((key) => {
  //         const recordKey = key as keyof Partial<Record>;
  //         matched =
  //           record[recordKey] === matchCriteria[recordKey] ? matched : false;
  //       });
  //       return matched;
  //     }
  //   );
  //   return retrievedRecords;
  // }

  // async updateEntries(
  //   matchCriteria: Partial<Record>,
  //   updateValues: Partial<Record>
  // ): Promise<Record[] | null> {}

  showRecords(): void {
    console.log(this.storedRecords);
  }
}
