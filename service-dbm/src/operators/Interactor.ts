import { Record, IRecord } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';
import { ResponseHTTP } from '../entities/ResponseHTTP';
import { Payload } from '../entities/Payload';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    if (parsedBody.records) {
      try {
        const recordsToCreate: IRecord[] = await Record.parseRecords(
          parsedBody.records
        );
        const recordBundle: IRecord[] = await Record.processRecords(
          recordsToCreate
        );
        const insertedRecords: number =
          await this.recordRepository.createEntries(recordBundle);
        const payload: Payload = { payload: insertedRecords };
        const response: ResponseHTTP = {
          statusCode: 201,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        };
        return response;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Missing inputs');
    }
  }

  async updateRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    if (parsedBody.match && parsedBody.update) {
      try {
        const updateCriteria: Partial<IRecord> =
          await Record.parseRecordPartial(parsedBody.match);
        const updateValues: Partial<IRecord> = await Record.parseRecordPartial(
          parsedBody.update
        );
        const updatedRecords: number =
          await this.recordRepository.updateEntries(
            updateCriteria,
            updateValues
          );
        const payload: Payload = { payload: updatedRecords };
        const response: ResponseHTTP = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        };
        return response;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Missing inputs');
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
      const payload: Payload = { payload: fetchedRecords };
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
      const payload: Payload = { payload: deletedRecords };
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
