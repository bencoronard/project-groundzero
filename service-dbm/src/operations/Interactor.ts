import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async createRecords(recordsToCreate: Record[]): Promise<string> {
    const recordBundle: Record[] = await processRecords(recordsToCreate);
    const insertedRecords: Record[] = await this.recordRepository.createEntries(
      recordBundle
    );
    return `Number of records created: ${insertedRecords.length}`;
  }

  async fetchRecords(
    fetchCriteria: Partial<Record>,
    fetchLimit?: number,
    fetchOffset?: number
  ): Promise<string> {
    const fetchedRecords: Record[] = await this.recordRepository.readEntries(
      fetchCriteria,
      fetchLimit,
      fetchOffset
    );
    return JSON.stringify(fetchedRecords);
  }

  async updateRecords(
    updateCriteria: Partial<Record>,
    updateValues: Partial<Record>
  ): Promise<string> {
    const updatedRecords: Record[] = await this.recordRepository.updateEntries(
      updateCriteria,
      updateValues
    );
    return `Number of records updated: ${updatedRecords.length}`;
  }

  async deleteRecords(
    deleteCriteria: Partial<Record>,
    deleteOffset?: number
  ): Promise<string> {
    const deletedRecords = await this.recordRepository.deleteEntries(
      deleteCriteria,
      deleteOffset
    );
    return `Number of records deleted: ${deletedRecords.length}`;
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
