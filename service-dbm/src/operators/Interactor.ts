import { Record, IRecord } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { Payload } from '../shared/Payload';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      if (!parsedBody.records) {
        throw new Error('Missing inputs');
      }
      const recordsToCreate: IRecord[] = await Record.parseRecords(
        parsedBody.records
      );
      const recordBundle: IRecord[] = await Record.processRecords(
        recordsToCreate
      );
      const insertedRecords: number = await this.recordRepository.createEntries(
        recordBundle
      );
      const payload: Payload = {
        isError: false,
        desc: 'Number of records created',
        data: insertedRecords,
      };
      const response: ResponseHTTP = {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      if (!(parsedBody.match && parsedBody.update)) {
        throw new Error('Missing inputs');
      }
      const updateCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedBody.match
      );
      const updateValues: Partial<IRecord> = await Record.parseRecordPartial(
        parsedBody.update
      );
      const updatedRecords: number = await this.recordRepository.updateEntries(
        updateCriteria,
        updateValues
      );
      const payload: Payload = {
        isError: false,
        desc: 'Number of records updated',
        data: updatedRecords,
      };
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      const fetchCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedQuery
      );
      const fetchLimit: number =
        parsedQuery.limit && parsedQuery.limit >= 0
          ? parseInt(parsedQuery.limit)
          : 100;
      const fetchOffset: number =
        parsedQuery.offset && parsedQuery.limit >= 0
          ? parseInt(parsedQuery.offset)
          : 0;
      const fetchedRecords: IRecord[] = await this.recordRepository.readEntries(
        fetchCriteria,
        fetchLimit,
        fetchOffset
      );
      const payload: Payload = {
        isError: false,
        desc: 'Retrieved records',
        data: fetchedRecords,
      };
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      const deleteCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedQuery
      );
      const deletedRecords: number = await this.recordRepository.deleteEntries(
        deleteCriteria
      );
      const payload: Payload = {
        isError: false,
        desc: 'Number of records deleted',
        data: deletedRecords,
      };
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      };
      return response;
    } catch (error) {
      throw error;
    }
  }
}
