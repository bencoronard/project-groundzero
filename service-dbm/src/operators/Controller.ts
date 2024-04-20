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
      let response: ResponseHTTP = {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Invalid request',
      };
      switch (request.method.toUpperCase()) {
        case 'GET':
          if (request.queryParams) {
            response = await this.recordInteractor.fetchRecords(
              request.queryParams
            );
          }
          break;

        case 'POST':
          if (request.body) {
            response = await this.recordInteractor.createRecords(request.body);
          }
          break;

        case 'PUT':
          if (request.body) {
            response = await this.recordInteractor.updateRecords(request.body);
          }
          break;

        case 'DELETE':
          if (request.queryParams) {
            response = await this.recordInteractor.deleteRecords(
              request.queryParams
            );
          }
          break;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
