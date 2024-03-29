import { Record } from '../entities/Record';
import { RecordInteractor } from '../entities/RecordInteractor';
import { RequestHTTP } from '../entities/RequestHTTP';

export class Controller {
  private recordInteractor: RecordInteractor;
  constructor(injectedInteractor: RecordInteractor) {
    this.recordInteractor = injectedInteractor;
  }
  async route(request: RequestHTTP): Promise<string> {
    let response: string = 'Invalid request';

    switch (request.method.toUpperCase()) {
      case 'GET':
        if (request.queryParams) {
          try {
            const queryData: Partial<Record> = request.queryParams;
            const limit: number | undefined = queryData.limit
              ? queryData.limit
              : undefined;
            response = await this.recordInteractor.fetchRecords(
              queryData,
              queryData.limit,
              queryData.offset
            );
          } catch {
            response = 'Invalid query data';
          }
        }
        break;

      case 'POST':
        if (request.body && request.body.records) {
          try {
            const records: Record[] = request.body.records;
            response = await this.recordInteractor.createRecords(records);
          } catch {
            response = 'Invalid records data';
          }
        }
        break;

      case 'PUT':
        break;

      case 'DELETE':
        break;
    }

    return response;
  }
}
