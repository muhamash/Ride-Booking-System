"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRoute = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = require("http-status-codes");
const controller_util_1 = require("../../utils/controller.util");
exports.homeRoute = (0, controller_util_1.asyncHandler)(async (req, res, next) => {
    (0, controller_util_1.responseFunction)(res, {
        message: `This is the home route! Service is running!`,
        statusCode: http_status_codes_1.StatusCodes.OK,
        data: null
    });
});
