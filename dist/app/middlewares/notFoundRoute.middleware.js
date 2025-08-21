"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalNotFoundResponse = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const controller_util_1 = require("../utils/controller.util");
exports.globalNotFoundResponse = (0, controller_util_1.asyncHandler)(async (req, res, next) => {
    (0, controller_util_1.responseFunction)(res, {
        statusCode: http_status_codes_1.default.NOT_FOUND,
        message: "Route not found!",
        data: null
    });
});
