"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const app_1 = __importDefault(require("./app/app"));
const mongoos_config_1 = require("./config/db/mongoos.config");
const startServer = async () => {
    try {
        await (0, mongoos_config_1.dbConnect)();
        const server = app_1.default.listen(3000, () => {
            console.log(`Server is listening at port : 3000 😁`);
            console.log(`Server entry : http://localhost:3000 🛜`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
startServer();
