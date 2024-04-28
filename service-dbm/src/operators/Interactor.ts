import { Record, IRecord } from '../entities/Record';
import { RecordRepository } from '../entities/RecordRepository';
import { RecordInteractor } from '../entities/RecordInteractor';
import { ResponseHTTP, IResponseHTTP } from '../shared/ResponseHTTP';

export class Interactor implements RecordInteractor {
  private recordRepository: RecordRepository;

  constructor(injectedRepository: RecordRepository) {
    // Injected database
    this.recordRepository = injectedRepository;
  }

  async createRecords(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
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
      // Set successful response
      response
        .setStatus(201)
        .getBody()
        .setError(false)
        .setDesc('Number of records created')
        .setPayload(insertedRecords);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error creating records: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async updateRecords(parsedBody: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
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
      // Set successful response
      response
        .setStatus(200)
        .getBody()
        .setError(false)
        .setDesc('Number of records updated')
        .setPayload(updatedRecords);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error creating records: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async fetchRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
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
      // Set successful response
      response
        .setStatus(200)
        .getBody()
        .setError(false)
        .setDesc('Retrieved records')
        .setPayload(fetchedRecords);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error creating records: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }

  async deleteRecords(parsedQuery: {
    [key: string]: any;
  }): Promise<IResponseHTTP> {
    // Initialize response
    const response: ResponseHTTP = new ResponseHTTP();
    try {
      // Parse delete criteria
      const deleteCriteria: Partial<IRecord> = await Record.parseRecordPartial(
        parsedQuery
      );
      // Execute Delete record operation
      const deletedRecords: number = await this.recordRepository.deleteEntries(
        deleteCriteria
      );
      // Set successful response
      response
        .setStatus(200)
        .getBody()
        .setError(false)
        .setDesc('Number of records deleted')
        .setPayload(deletedRecords);
      // Return successful response
      return response.seal();
    } catch (error) {
      // Set error response
      response
        .getBody()
        .setDesc('Error message')
        .setPayload('Error creating records: ' + (error as Error).message);
      // Return error response
      return response.seal();
    }
  }
}
