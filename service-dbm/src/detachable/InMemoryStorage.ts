import { readFileSync } from "fs";
import { Record } from "../entities/Record";
import { RecordRepository } from "../entities/RecordRepository";
import path from "path";

export class InMemoryStorage implements RecordRepository {
  private storedRecords: Record[];
  constructor() {
    this.storedRecords = JSON.parse(
      readFileSync(path.join(__dirname, "..", "agents.json"), "utf-8")
    );
  }

  async createEntries(recordsToInsert: Record[]): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const insertedRecords: Record[] = [];
      try {
        recordsToInsert.forEach((record) => {
          this.storedRecords.push(record);
          insertedRecords.push(record);
        });
        resolve(insertedRecords);
      } catch {
        reject(insertedRecords);
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
