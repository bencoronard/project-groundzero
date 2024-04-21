import { RecordInteractor } from '../entities/RecordInteractor';
import { RequestHTTP } from '../shared/RequestHTTP';
import { ResponseHTTP } from '../shared/ResponseHTTP';

export class Controller {
  private recordInteractor: RecordInteractor;

  constructor(injectedInteractor: RecordInteractor) {
    this.recordInteractor = injectedInteractor;
  }

  async route(request: RequestHTTP): Promise<ResponseHTTP> {
    try {
      switch (request.method.toUpperCase()) {
        case 'GET':
          if (request.queryParams) {
            return await this.recordInteractor.fetchRecords(
              request.queryParams
            );
          }

        case 'POST':
          if (request.body) {
            return await this.recordInteractor.createRecords(request.body);
          }

        case 'PUT':
          if (request.body) {
            return await this.recordInteractor.updateRecords(request.body);
          }

        case 'DELETE':
          if (request.queryParams) {
            return await this.recordInteractor.deleteRecords(
              request.queryParams
            );
          }

        default:
          return {
            statusCode: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              isError: true,
              desc: 'Error message',
              data: 'Invalid request',
            }),
          };
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isError: true,
          desc: 'Error message',
          data: (error as Error).message,
        }),
      };
    }
  }
}
