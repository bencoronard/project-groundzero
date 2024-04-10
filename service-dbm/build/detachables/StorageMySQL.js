"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.StorageMySQL = void 0;
const Record_1 = require("../entities/Record");
const mysql = __importStar(require("mysql2/promise"));
class StorageMySQL {
    constructor(config) {
        this.pool = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
        });
        this.database = config.database;
        this.table = config.table;
    }
    readEntries(matchCriteria, matchLimit, matchOffset) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                const [matchConditions, conn] = yield Promise.all([
                    parseConditions(matchCriteria, ' AND '),
                    this.pool.getConnection(),
                ]);
                const { conditions: matchString, values: matchValues } = matchConditions;
                connection = conn;
                const query = `
        SELECT ${Record_1.Record.getAttributes().join(', ')}
        FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString}
        LIMIT ${matchLimit}
        OFFSET ${matchOffset};
    `;
                const [result] = yield connection.query(query, matchValues);
                return result;
            }
            catch (error) {
                throw error;
            }
            finally {
                if (connection) {
                    connection.release();
                }
            }
        });
    }
    updateEntries(matchCriteria, updateCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                const [matchConditions, updateConditions, conn] = yield Promise.all([
                    parseConditions(matchCriteria, ' AND '),
                    parseConditions(updateCriteria, ', '),
                    this.pool.getConnection(),
                ]);
                const { conditions: matchString, values: matchValues } = matchConditions;
                const { conditions: updateString, values: updateValues } = updateConditions;
                connection = conn;
                const query = `
        UPDATE \`${this.database}\`.\`${this.table}\`
        SET ${updateString}
        WHERE ${matchString};
    `;
                const [result] = yield connection.query(query, updateValues.concat(matchValues));
                return result.affectedRows;
            }
            catch (error) {
                throw error;
            }
            finally {
                if (connection) {
                    connection.release();
                }
            }
        });
    }
    createEntries(recordsToInsert) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                const [records, conn] = yield Promise.all([
                    parseRecords(recordsToInsert),
                    this.pool.getConnection(),
                ]);
                connection = conn;
                const query = `
        INSERT INTO \`${this.database}\`.\`${this.table}\` (${Record_1.Record.getAttributes().join(', ')})
        VALUES ?;
      `;
                const [result] = yield connection.query(query, [records]);
                return result.affectedRows;
            }
            catch (error) {
                throw error;
            }
            finally {
                if (connection) {
                    connection.release();
                }
            }
        });
    }
    deleteEntries(matchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                const [matchConditions, conn] = yield Promise.all([
                    parseConditions(matchCriteria, ' AND '),
                    this.pool.getConnection(),
                ]);
                const { conditions: matchString, values: matchValues } = matchConditions;
                connection = conn;
                const query = `
        DELETE FROM \`${this.database}\`.\`${this.table}\`
        WHERE ${matchString};
    `;
                const [result] = yield connection.query(query, matchValues);
                return result.affectedRows;
            }
            catch (error) {
                throw error;
            }
            finally {
                if (connection) {
                    connection.release();
                }
            }
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.pool) {
                    yield this.pool.end();
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.StorageMySQL = StorageMySQL;
function parseConditions(input, separator) {
    return __awaiter(this, void 0, void 0, function* () {
        let parsedConditions = '';
        const parsedValues = [];
        Object.keys(input).forEach((key) => {
            parsedConditions += key + ' = ' + '?' + separator;
            parsedValues.push(input[key]);
        });
        parsedConditions = parsedConditions.slice(0, -separator.length);
        return { conditions: parsedConditions, values: parsedValues };
    });
}
function parseRecords(input) {
    return __awaiter(this, void 0, void 0, function* () {
        return input.map((record) => {
            const array = [];
            Object.keys(record).forEach((key) => {
                array.push(record[key]);
            });
            return array;
        });
    });
}
