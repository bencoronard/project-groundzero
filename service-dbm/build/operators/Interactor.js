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
exports.Interactor = void 0;
const Record_1 = require("../entities/Record");
class Interactor {
    constructor(injectedRepository) {
        this.recordRepository = injectedRepository;
    }
    createRecords(parsedBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parsedBody.records) {
                try {
                    const recordsToCreate = yield Record_1.Record.parseRecords(parsedBody.records);
                    const numRecords = recordsToCreate.length;
                    const recordBundle = yield Record_1.Record.processRecords(recordsToCreate);
                    const insertedRecords = yield this.recordRepository.createEntries(recordBundle);
                    const response = {
                        statusCode: 201,
                        headers: { 'Content-Type': 'text/plain' },
                        body: `Number of records created: ${insertedRecords} of ${numRecords}`,
                    };
                    return response;
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                throw new Error('Missing inputs');
            }
        });
    }
    updateRecords(parsedBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parsedBody.match && parsedBody.update) {
                try {
                    const updateCriteria = yield Record_1.Record.parseRecordPartial(parsedBody.match);
                    const updateValues = yield Record_1.Record.parseRecordPartial(parsedBody.update);
                    const updatedRecords = yield this.recordRepository.updateEntries(updateCriteria, updateValues);
                    const response = {
                        statusCode: 200,
                        headers: { 'Content-Type': 'text/plain' },
                        body: `Number of records updated: ${updatedRecords}`,
                    };
                    return response;
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                throw new Error('Missing inputs');
            }
        });
    }
    fetchRecords(parsedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchCriteria = yield Record_1.Record.parseRecordPartial(parsedQuery);
                const fetchLimit = parsedQuery.limit && parsedQuery.limit >= 0
                    ? parseInt(parsedQuery.limit)
                    : 100;
                const fetchOffset = parsedQuery.offset && parsedQuery.limit >= 0
                    ? parseInt(parsedQuery.offset)
                    : 0;
                const fetchedRecords = yield this.recordRepository.readEntries(fetchCriteria, fetchLimit, fetchOffset);
                const response = {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fetchedRecords),
                };
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRecords(parsedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteCriteria = yield Record_1.Record.parseRecordPartial(parsedQuery);
                const deletedRecords = yield this.recordRepository.deleteEntries(deleteCriteria);
                const response = {
                    statusCode: 200,
                    headers: { 'Content-Type': 'text/plain' },
                    body: `Number of records deleted: ${deletedRecords}`,
                };
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Interactor = Interactor;
