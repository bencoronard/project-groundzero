import { UserInteractor } from '../entities/UserInteractor';
import { RequestHTTP } from '../entities/RequestHTTP';
import { ResponseHTTP } from '../entities/ResponseHTTP';

export class Controller {
  private userInteractor: UserInteractor;

  constructor(injectedInteractor: UserInteractor) {
    this.userInteractor = injectedInteractor;
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
            // response = await this.userInteractor.fetchRecords(
            //   request.queryParams
            // );
          }
          break;

        case 'POST':
          if (request.body) {
            // response = await this.userInteractor.createRecords(request.body);
          }
          break;

        case 'PUT':
          if (request.body) {
            // response = await this.userInteractor.updateRecords(request.body);
          }
          break;

        case 'DELETE':
          if (request.queryParams) {
            // response = await this.userInteractor.deleteRecords(
            //   request.queryParams
            // );
          }
          break;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}
