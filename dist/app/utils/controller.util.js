"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = exports.responseFunction = exports.asyncHandler = void 0;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        console.log(error);
        next(error);
    });
};
exports.asyncHandler = asyncHandler;
const responseFunction = (res, data) => {
    // console.log(data)
    res.status(data.statusCode).json({
        message: data.message,
        statusCode: data.statusCode,
        meta: data.meta,
        data: data.data
    });
};
exports.responseFunction = responseFunction;
const setCookie = async (res, cookieName, cookieData, maxAge) => {
    res.cookie(cookieName, cookieData, {
        httpOnly: true,
        secure: false,
        maxAge
    });
};
exports.setCookie = setCookie;
