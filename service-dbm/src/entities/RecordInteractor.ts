export interface RecordInteractor {
  createRecords(parsedBody: { [key: string]: any }): Promise<string>;

  fetchRecords(parsedQuery: { [key: string]: any }): Promise<string>;

  updateRecords(parsedBody: { [key: string]: any }): Promise<string>;

  deleteRecords(parsedQuery: { [key: string]: any }): Promise<string>;
}
