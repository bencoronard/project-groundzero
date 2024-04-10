"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressHTTP = void 0;
class ExpressHTTP {
    constructor(request) {
        this.path = request.path;
        this.method = request.method;
        this.pathParams = request.params;
        this.queryParams = request.query;
        this.body = request.body;
    }
}
exports.ExpressHTTP = ExpressHTTP;
