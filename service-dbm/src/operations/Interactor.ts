import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: { [key: string]: any }): Promise<string> {
    let operationResult: string = 'No input records found';
    if (parsedBody.records) {
      try {
        const recordsToCreate: Record[] = parsedBody.records;
        const numRecords: number = recordsToCreate.length;
        const recordBundle: Record[] = await processRecords(recordsToCreate);
        const insertedRecords: Record[] =
          await this.recordRepository.createEntries(recordBundle);
        operationResult = `Number of records created: ${insertedRecords.length} of ${numRecords}`;
      } catch {
        operationResult = 'Invalid input format';
      }
    }
    return operationResult;
  }

  async updateRecords(
    updateCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<string> {
    let operationResult: string;
    try {
      const updatedRecords: Record[] =
        await this.recordRepository.updateEntries(updateCriteria, updateValues);
      operationResult = `Number of records updated: ${updatedRecords.length}`;
    } catch {
      operationResult = 'Error updating records';
    }
    return operationResult;
  }

  async fetchRecords(
    fetchCriteria: Partial<Record>,
    fetchLimit?: number,
    fetchOffset?: number
  ): Promise<string> {
    let operationResult: string;
    try {
      const limit: number =
        fetchLimit && fetchLimit >= 0
          ? fetchLimit
          : this.recordRepository.numEntries;
      const offset: number = fetchOffset && fetchOffset >= 0 ? fetchOffset : 0;
      const fetchedRecords: Record[] = await this.recordRepository.readEntries(
        fetchCriteria,
        limit,
        offset
      );
      operationResult = JSON.stringify(fetchedRecords);
    } catch {
      operationResult = 'Error fetching records';
    }
    return operationResult;
  }

  async deleteRecords(
    deleteCriteria: Partial<Record>,
    deleteOffset?: number
  ): Promise<string> {
    let operationResult: string;
    try {
      const offset: number =
        deleteOffset && deleteOffset >= 0 ? deleteOffset : 0;
      const deletedRecords = await this.recordRepository.deleteEntries(
        deleteCriteria,
        offset
      );
      operationResult = `Number of records deleted: ${deletedRecords.length}`;
    } catch {
      operationResult = 'Error deleting records';
    }
    return operationResult;
  }
}

async function processRecords(records: Record[]): Promise<Record[]> {
  return new Promise((resolve, reject) => {
    const processedRecords: Record[] = [];
    try {
      records.forEach((record) => {
        processedRecords.push({
          field1: record.field1,
          field2: record.field2,
          field3: record.field3,
          field4: record.field4,
        });
      });
      resolve(processedRecords);
    } catch {
      reject(processedRecords);
    }
  });
}
