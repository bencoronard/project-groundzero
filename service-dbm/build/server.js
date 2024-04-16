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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const ExpressHTTP_1 = require("./detachables/ExpressHTTP");
const Interactor_1 = require("./operators/Interactor");
const Controller_1 = require("./operators/Controller");
const StorageMySQL_1 = require("./detachables/StorageMySQL");
const StorageMongoDB_1 = require("./detachables/StorageMongoDB");
class Server {
    constructor() {
        try {
            dotenv_1.default.config();
            this.params = this.config();
            this.db = this.setupDB();
            this.app = (0, express_1.default)();
        }
        catch (error) {
            throw error;
        }
    }
    config() {
        if (process.env.PORT && process.env.DB_TYPE) {
            return {
                port: parseInt(process.env.PORT, 10),
                dbType: process.env.DB_TYPE,
            };
        }
        else {
            throw new Error('Missing environment variables');
        }
    }
    setupDB() {
        try {
            if (process.env.CONFIG_MYSQL && this.params.dbType === 'MySQL') {
                const credentials = JSON.parse(process.env.CONFIG_MYSQL);
                if (credentials.host &&
                    credentials.user &&
                    credentials.password &&
                    credentials.database &&
                    credentials.table) {
                    return new StorageMySQL_1.StorageMySQL(credentials);
                }
                else {
                    throw new Error('Incomplete database config');
                }
            }
            else if (process.env.CONFIG_MONGO && this.params.dbType === 'MongoDB') {
                const credentials = JSON.parse(process.env.CONFIG_MONGO);
                if (credentials.uri && credentials.database && credentials.collection) {
                    return new StorageMongoDB_1.StorageMongoDB(credentials);
                }
                else {
                    throw new Error('Incomplete database config');
                }
            }
            else {
                throw new Error('Missing or invalid database config');
            }
        }
        catch (error) {
            throw error;
        }
    }
    start() {
        try {
            const interactor = new Interactor_1.Interactor(this.db);
            const controller = new Controller_1.Controller(interactor);
            this.app.use(express_1.default.json());
            this.app.use(express_1.default.urlencoded({ extended: false }));
            this.app.all('/records*', (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const reqHTTP = new ExpressHTTP_1.ExpressHTTP(req);
                    const resHTTP = yield controller.route(reqHTTP);
                    res.status(resHTTP.statusCode);
                    res.set(resHTTP.headers);
                    res.send(resHTTP.body);
                }
                catch (error) {
                    res.status(500).send(error.message);
                }
            }));
            this.app.listen(this.params.port, () => {
                console.log(`Server listening on port: ${this.params.port}`);
            });
        }
        catch (error) {
            throw error;
        }
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.closeConnection();
                console.log('Database connections closed');
            }
            catch (_a) {
                throw new Error('Error closing database connections');
            }
        });
    }
}
exports.Server = Server;
