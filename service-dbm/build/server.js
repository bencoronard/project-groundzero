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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ExpressHTTP_1 = require("./detachables/ExpressHTTP");
const Interactor_1 = require("./operators/Interactor");
const Controller_1 = require("./operators/Controller");
const StorageMySQL_1 = require("./detachables/StorageMySQL");
const StorageMongoDB_1 = require("./detachables/StorageMongoDB");
const app = (0, express_1.default)();
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { port: PORT, db: database } = yield initialize();
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                yield closeDB(database);
            }));
            app.listen(PORT, () => {
                console.log(`Server listening on port: ${PORT}`);
            });
        }
        catch (error) {
            console.error(`Error starting the server...\n`, error);
            process.exit(1);
        }
    });
}
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            dotenv_1.default.config();
            const result = { port: 0, db: {} };
            if (process.env.PORT && process.env.DB_TYPE) {
                result.port = parseInt(process.env.PORT, 10);
                const dbType = process.env.DB_TYPE;
                if (process.env.CONFIG_MYSQL && dbType === 'MySQL') {
                    const config = JSON.parse(process.env.CONFIG_MYSQL);
                    if (config.host &&
                        config.user &&
                        config.password &&
                        config.database &&
                        config.table) {
                        result.db = new StorageMySQL_1.StorageMySQL(config);
                    }
                    else {
                        throw new Error('Incomplete database config');
                    }
                }
                else if (process.env.CONFIG_MONGO && dbType === 'MongoDB') {
                    const config = JSON.parse(process.env.CONFIG_MONGO);
                    if (config.uri && config.database && config.collection) {
                        result.db = new StorageMongoDB_1.StorageMongoDB(config);
                    }
                    else {
                        throw new Error('Incomplete database config');
                    }
                }
                else {
                    throw new Error('Missing or invalid database config');
                }
                return result;
            }
            else {
                throw new Error('Missing environment variables');
            }
        }
        catch (error) {
            throw error;
        }
    });
}
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const server = yield setup();
            const interactor = new Interactor_1.Interactor(server.db);
            const controller = new Controller_1.Controller(interactor);
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: false }));
            app.all('/records*', (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            return server;
        }
        catch (error) {
            throw error;
        }
    });
}
function closeDB(db) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.closeConnection();
            console.log('Database connections closed');
            process.exit(0);
        }
        catch (_a) {
            console.error('Error closing database connections');
            process.exit(1);
        }
    });
}
