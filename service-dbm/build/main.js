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
const server_1 = require("./server");
const server = new server_1.Server();
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.stop();
        process.exit(0);
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}));
try {
    server.start();
}
catch (_a) {
    console.error('Error starting the server');
    process.exit(1);
}
