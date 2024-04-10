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
exports.StorageMongoDB = void 0;
const mongo = __importStar(require("mongodb"));
class StorageMongoDB {
    constructor(config) {
        this.client = new mongo.MongoClient(config.uri);
        this.client.connect();
        this.database = config.database;
        this.collection = this.client
            .db(this.database)
            .collection(config.collection);
    }
    createEntries(recordsToInsert) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.collection.insertMany(recordsToInsert);
                return (_a = result.insertedCount) !== null && _a !== void 0 ? _a : 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    readEntries(matchCriteria, matchLimit, matchOffset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.collection
                    .find(matchCriteria)
                    .limit(matchLimit)
                    .skip(matchOffset)
                    .toArray();
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateEntries(matchCriteria, updateCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.collection.updateMany(matchCriteria, {
                    $set: updateCriteria,
                });
                return (_a = result.modifiedCount) !== null && _a !== void 0 ? _a : 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteEntries(matchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.collection.deleteMany(matchCriteria);
                return (_a = result.deletedCount) !== null && _a !== void 0 ? _a : 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.client) {
                    yield this.client.close();
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.StorageMongoDB = StorageMongoDB;
