"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorResponse = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_error_1 = require("../../config/errors/App.error");
const middleware_util_1 = require("../utils/middleware.util");
const globalErrorResponse = (error, req, res, next) => {
    let statusCode = http_status_codes_1.default.BAD_REQUEST;
    let message = "Something went wrong";
    let stack;
    // Handle Zod errors
    if ((0, middleware_util_1.isZodError)(error)) {
        const zodError = error;
        const fieldIssues = (0, middleware_util_1.parseZodError)(zodError);
        let customIssues = [];
        try {
            customIssues = JSON.parse(zodError.message) || [];
        }
        catch (e) {
            customIssues = [];
        }
        // Get the first available field name from either path or field
        const fieldName = customIssues[0]?.path?.[0] ??
            fieldIssues[0]?.field ??
            'unknown_field';
        // Get the first available error message
        const errorMessage = fieldIssues[0]?.message ??
            customIssues[0]?.message ??
            "Validation error";
        message = `Validation error on field '${fieldName}': ${errorMessage}`;
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({
            name: zodError.name || "ZodError",
            message,
            status: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            errors: customIssues.length ? customIssues : fieldIssues,
            ...(process.env.NODE_ENV === "development" && { stack: zodError.stack }),
        });
    }
    // Handle Mongoose CastError
    if (error instanceof mongoose_1.default.Error.CastError) {
        message = `Invalid value for '${error.path}': ${error.value}`;
        statusCode = http_status_codes_1.default.BAD_REQUEST;
    }
    // Handle Mongoose ValidationError
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        const errors = Object.values(error.errors).map((err) => ({
            field: err.path,
            message: err.message,
        }));
        message = `Validation failed on ${errors.length} field(s).`;
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({
            name: "MongooseValidationError",
            message,
            status: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            errors,
            ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
        });
    }
    // Handle MongoDB duplicate key errors
    else if (isMongoDuplicateError(error)) {
        const mongoError = error;
        const dupFields = Object.keys(mongoError.keyValue || {});
        message = `Duplicate field value: ${dupFields.join(", ")}. Please use another value.`;
        statusCode = http_status_codes_1.default.CONFLICT;
    }
    // Handle custom AppError
    else if (error instanceof App_error_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
        stack = error.stack;
    }
    // Handle general Error objects
    else if (error instanceof Error) {
        const customError = error;
        message = error.message;
        stack = error.stack;
        statusCode = customError.statusCode || http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    }
    // Fallback for unknown errors
    else {
        message = "An unexpected error occurred.";
        statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR;
    }
    console.error(error);
    // Build response
    const responsePayload = {
        name: error.name || "Error",
        message,
        status: statusCode,
        success: false,
    };
    if (process.env.NODE_ENV === "development") {
        if (stack) {
            responsePayload.stack = stack;
        }
        else if (error.stack) {
            responsePayload.stack = error.stack;
        }
    }
    return res.status(statusCode).json(responsePayload);
};
exports.globalErrorResponse = globalErrorResponse;
// Helper function to check for MongoDB duplicate errors
function isMongoDuplicateError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000);
}
