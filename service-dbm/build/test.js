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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
const baseUrl = `http://localhost:${PORT}/records`;
const queryParams = {
    field4: 'TH',
    limit: 20,
    offset: 0,
};
const updateData = {
    match: { field4: 'TH' },
    update: { field3: 'Sawasdee' },
};
const postData = {
    records: [
        {
            field1: 500,
            field2: 'John',
            field3: 'Doe',
            field4: 'TH',
        },
        {
            field1: 501,
            field2: 'James',
            field3: 'Dean',
            field4: 'TH',
        },
        {
            field1: 502,
            field2: 'Jack',
            field3: 'Dawn',
            field4: 'TH',
        },
        {
            field1: 504,
            field2: 'Levi',
            field3: 'Strauss',
            field4: 'TH',
        },
    ],
};
test();
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default
            .post(baseUrl, postData)
            .then((response) => {
            console.log('Response:', response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
        yield axios_1.default
            .get(baseUrl, { params: queryParams })
            .then((response) => {
            console.log(`Response:\n`, response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
        yield axios_1.default
            .put(baseUrl, updateData)
            .then((response) => {
            console.log('Response:', response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
        yield axios_1.default
            .get(baseUrl, { params: queryParams })
            .then((response) => {
            console.log(`Response:\n`, response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
        yield axios_1.default
            .delete(baseUrl, { params: queryParams })
            .then((response) => {
            console.log('Response:', response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
        yield axios_1.default
            .get(baseUrl, { params: queryParams })
            .then((response) => {
            console.log(`Response:\n`, response.data);
        })
            .catch((error) => {
            console.error('Error:', error.response.data);
        });
    });
}
