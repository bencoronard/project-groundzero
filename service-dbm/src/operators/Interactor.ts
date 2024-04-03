import { Record } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';
import { ResponseHTTP } from '../entities/ResponseHTTP';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    const response: ResponseHTTP = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing inputs',
    };
    if (parsedBody.records) {
      try {
        const recordsToCreate: Record[] = parsedBody.records;
        const numRecords: number = recordsToCreate.length;
        const recordBundle: Record[] = await processRecords(recordsToCreate);
        const insertedRecords: Record[] =
          await this.recordRepository.createEntries(recordBundle);
        response.statusCode = 201;
        response.body = `Number of records created: ${insertedRecords.length} of ${numRecords}`;
      } catch {
        response.body = 'Invalid input format';
      }
    }
    return response;
  }

  async updateRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    const response: ResponseHTTP = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing inputs',
    };
    if (parsedBody.match && parsedBody.update) {
      try {
        const updateCriteria: Partial<Record> = parsedBody.match;
        const updateValues: Partial<Record> = parsedBody.update;
        const updatedRecords: Record[] =
          await this.recordRepository.updateEntries(
            updateCriteria,
            updateValues
          );
        response.statusCode = 200;
        response.body = `Number of records updated: ${updatedRecords.length}`;
      } catch {
        response.body = 'Invalid input format';
      }
    }
    return response;
  }

  async fetchRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    const response: ResponseHTTP = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing inputs',
    };
    try {
      const excludes: string[] = ['limit', 'offset'];
      const fetchCriteria: Partial<Record> = Object.keys(parsedQuery).reduce(
        (acc, key) => {
          if (!excludes.includes(key)) {
            acc[key as keyof Record] = parsedQuery[key];
          }
          return acc;
        },
        {} as Partial<Record>
      );
      const fetchLimit: number =
        parsedQuery.limit && parsedQuery.limit >= 0 ? parsedQuery.limit : 100;
      const fetchOffset: number =
        parsedQuery.offset && parsedQuery.offset >= 0 ? parsedQuery.offset : 0;
      const fetchedRecords: Record[] = await this.recordRepository.readEntries(
        fetchCriteria,
        fetchLimit,
        fetchOffset
      );
      response.statusCode = 200;
      response.headers = { 'Content-Type': 'application/json' };
      response.body = JSON.stringify(fetchedRecords);
    } catch {
      response.body = 'Invalid input format';
    }
    return response;
  }

  async deleteRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    const response: ResponseHTTP = {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Missing inputs',
    };
    try {
      const excludes: string[] = ['offset'];
      const deleteCriteria: Partial<Record> = Object.keys(parsedQuery).reduce(
        (acc, key) => {
          if (!excludes.includes(key)) {
            acc[key as keyof Record] = parsedQuery[key];
          }
          return acc;
        },
        {} as Partial<Record>
      );
      const deleteOffset: number =
        parsedQuery.offset && parsedQuery.offset >= 0 ? parsedQuery.offset : 0;
      const deletedRecords = await this.recordRepository.deleteEntries(
        deleteCriteria,
        deleteOffset
      );
      response.statusCode = 200;
      response.body = `Number of records deleted: ${deletedRecords.length}`;
    } catch {
      response.body = 'Invalid input format';
    }
    return response;
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
