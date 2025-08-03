"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            console.log("stack", stack);
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
