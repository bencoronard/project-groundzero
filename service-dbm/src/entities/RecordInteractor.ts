import { IResponseHTTP } from '../shared/ResponseHTTP';

export interface RecordInteractor {
  createRecords(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>;

  fetchRecords(parsedQuery: { [key: string]: any }): Promise<IResponseHTTP>;

  updateRecords(parsedBody: { [key: string]: any }): Promise<IResponseHTTP>;

  deleteRecords(parsedQuery: { [key: string]: any }): Promise<IResponseHTTP>;
}
