import { Record, IRecord } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';
import { ResponseHTTP } from '../shared/ResponseHTTP';
import { Parcel } from '../shared/Parcel';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    // Injected database
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Check missing inputs
      if (!parsedBody.records) {
        throw new Error('Missing inputs');
      }
      // Parse input records
      const recordsToCreate: IRecord[] = await Record.parseRecords(
        parsedBody.records
      );
      // Process input records
      const recordBundle: IRecord[] = await Record.processRecords(
        recordsToCreate
      );
      // Execute Create record operation
      const insertedRecords: number = await this.recordRepository.createEntries(
        recordBundle
      );
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: false,
        description: 'Number of records created',
        payload: insertedRecords,
      };
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
      // Return successful response
      return response;
    } catch (error) {
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: true,
        description: 'Error message',
        payload: 'Error creating records: ' + (error as Error).message,
      };
      // Return unsuccesssful response
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
    }
  }

  async updateRecords(parsedBody: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Check missing inputs
      if (!(parsedBody.match && parsedBody.update)) {
        throw new Error('Missing inputs');
      }
      // Parse update criteria
      const updateCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedBody.match
      );
      // Parse update values
      const updateValues: Partial<IRecord> = await Record.parseRecordPartial(
        parsedBody.update
      );
      // Execute Update record operation
      const updatedRecords: number = await this.recordRepository.updateEntries(
        updateCriteria,
        updateValues
      );
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: false,
        description: 'Number of records updated',
        payload: updatedRecords,
      };
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
      // Return successful response
      return response;
    } catch (error) {
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: true,
        description: 'Error message',
        payload: 'Error creating records: ' + (error as Error).message,
      };
      // Return unsuccesssful response
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
    }
  }

  async fetchRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Parse fetch criteria
      const fetchCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedQuery
      );
      // Parse fetch limit
      const fetchLimit: number =
        parsedQuery.limit && parsedQuery.limit >= 0
          ? parseInt(parsedQuery.limit)
          : 100;
      // Parse fetch offset
      const fetchOffset: number =
        parsedQuery.offset && parsedQuery.limit >= 0
          ? parseInt(parsedQuery.offset)
          : 0;
      // Execute Fetch record operation
      const fetchedRecords: IRecord[] = await this.recordRepository.readEntries(
        fetchCriteria,
        fetchLimit,
        fetchOffset
      );
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: false,
        description: 'Retrieved records',
        payload: fetchedRecords,
      };
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
      // Return successful response
      return response;
    } catch (error) {
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: true,
        description: 'Error message',
        payload: 'Error creating records: ' + (error as Error).message,
      };
      // Return unsuccesssful response
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
    }
  }

  async deleteRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<ResponseHTTP> {
    try {
      // Parse delete criteria
      const deleteCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedQuery
      );
      // Execute Delete record operation
      const deletedRecords: number = await this.recordRepository.deleteEntries(
        deleteCriteria
      );
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: false,
        description: 'Number of records deleted',
        payload: deletedRecords,
      };
      // Construct response
      const response: ResponseHTTP = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
      // Return successful response
      return response;
    } catch (error) {
      // Generate operation result packet for response
      const parcel: Parcel = {
        isError: true,
        description: 'Error message',
        payload: 'Error creating records: ' + (error as Error).message,
      };
      // Return unsuccesssful response
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: parcel,
      };
    }
  }
}
