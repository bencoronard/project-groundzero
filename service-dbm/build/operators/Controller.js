"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    constructor(injectedInteractor) {
        this.recordInteractor = injectedInteractor;
    }
    route(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = {
                    statusCode: 400,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Invalid request',
                };
                switch (request.method.toUpperCase()) {
                    case 'GET':
                        if (request.queryParams) {
                            response = yield this.recordInteractor.fetchRecords(request.queryParams);
                        }
                        break;
                    case 'POST':
                        if (request.body) {
                            response = yield this.recordInteractor.createRecords(request.body);
                        }
                        break;
                    case 'PUT':
                        if (request.body) {
                            response = yield this.recordInteractor.updateRecords(request.body);
                        }
                        break;
                    case 'DELETE':
                        if (request.queryParams) {
                            response = yield this.recordInteractor.deleteRecords(request.queryParams);
                        }
                        break;
                }
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Controller = Controller;
