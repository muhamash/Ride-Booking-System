"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../env.config");
const App_error_1 = require("../errors/App.error");
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(env_config_1.envStrings.DB_URL);
        console.log(`MongoDB database is connected!! 🥭`);
    }
    catch (error) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_GATEWAY, message);
    }
};
exports.dbConnect = dbConnect;
