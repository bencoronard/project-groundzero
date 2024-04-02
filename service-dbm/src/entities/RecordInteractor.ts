import { ResponseHTTP } from './ResponseHTTP';

export interface RecordInteractor {
  createRecords(parsedBody: { [key: string]: any }): Promise<ResponseHTTP>;

  fetchRecords(parsedQuery: { [key: string]: any }): Promise<ResponseHTTP>;

  updateRecords(parsedBody: { [key: string]: any }): Promise<ResponseHTTP>;

  deleteRecords(parsedQuery: { [key: string]: any }): Promise<ResponseHTTP>;
}
