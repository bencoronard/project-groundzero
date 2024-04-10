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
exports.Record = void 0;
class Record {
    static parseRecords(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedRecords = [];
                for (const item of input) {
                    if (typeof item.field1 === 'number' &&
                        typeof item.field2 === 'string' &&
                        typeof item.field3 === 'string' &&
                        typeof item.field4 === 'string') {
                        parsedRecords.push(item);
                    }
                    else {
                        throw new Error('Could not parse inputs');
                    }
                }
                return parsedRecords;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static parseRecordPartial(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedRecordPartial = {};
                if (typeof input.field1 === 'number') {
                    parsedRecordPartial.field1 = input.field1;
                }
                if (typeof input.field2 === 'string') {
                    parsedRecordPartial.field2 = input.field2;
                }
                if (typeof input.field3 === 'string') {
                    parsedRecordPartial.field3 = input.field3;
                }
                if (typeof input.field4 === 'string') {
                    parsedRecordPartial.field4 = input.field4;
                }
                if (Object.keys(parsedRecordPartial).length === 0) {
                    throw new Error('Could not parse inputs');
                }
                else {
                    return parsedRecordPartial;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    static processRecords(records) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const processedRecords = [];
                records.forEach((record) => {
                    processedRecords.push({
                        field1: record.field1,
                        field2: record.field2,
                        field3: record.field3,
                        field4: record.field4,
                    });
                });
                return processedRecords;
            }
            catch (_a) {
                throw new Error('Could not process records');
            }
        });
    }
    static getAttributes() {
        return ['field1', 'field2', 'field3', 'field4'];
    }
}
exports.Record = Record;
