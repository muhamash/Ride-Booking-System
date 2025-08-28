"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_config_1 = require("../../config/env.config");
const App_error_1 = require("../../config/errors/App.error");
const user_model_1 = require("../modules/user/user.model");
const middleware_util_1 = require("../utils/middleware.util");
;
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        // console.log(req.cookies)
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, "No Token Received!");
        }
        const verifiedToken = (0, middleware_util_1.verifyToken)(accessToken, env_config_1.envStrings.ACCESS_TOKEN_SECRET);
        // console.log(verifiedToken, accessToken)
        if (!verifiedToken.username) {
            throw new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Invalid token payload");
        }
        const user = await user_model_1.User.findOne({ username: verifiedToken.username }).select('+isBlocked');
        if (!user) {
            throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, `User not found`);
        }
        if (user.isBlocked) {
            throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, "User is blocked");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, `You are not permitted to view this route! Your role: ${verifiedToken.role}`);
        }
        req.user = verifiedToken;
        req.userLocation = user.location;
        next();
    }
    catch (error) {
        if (error instanceof App_error_1.AppError) {
            next(error);
        }
        else if (error instanceof Error) {
            next(new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, error.message));
        }
        else {
            next(new App_error_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Unknown authentication error"));
        }
    }
};
exports.checkAuth = checkAuth;
