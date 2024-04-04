import { RecordInteractor } from '../entities/RecordInteractor';
import { RequestHTTP } from '../entities/RequestHTTP';
import { ResponseHTTP } from '../entities/ResponseHTTP';

export class Controller {
  private recordInteractor: RecordInteractor;

  constructor(injectedInteractor: RecordInteractor) {
    this.recordInteractor = injectedInteractor;
  }

  async route(request: RequestHTTP): Promise<ResponseHTTP> {
    let response: ResponseHTTP = {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Invalid request',
    };

    try {
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
    } catch {
      response.statusCode = 500;
      response.body = 'Could not complete the requested operation';
    }

    return response;
  }
}
