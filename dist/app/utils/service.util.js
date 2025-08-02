"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTokens = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_config_1 = require("../../config/env.config");
const App_error_1 = require("../../config/errors/App.error");
const middleware_util_1 = require("./middleware.util");
const userTokens = async (user) => {
    const userData = 'user' in user ? user.user : user;
    const userId = userData.id || userData._id?.toString();
    const email = userData.email;
    const role = userData.role;
    const name = userData.name;
    const username = userData.username || '';
    if (!userId || !email || !role || !name) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Missing required user info for token generation.");
    }
    const jwtPayload = {
        userId,
        username,
        email,
        role,
        name,
    };
    try {
        const accessToken = (0, middleware_util_1.generateToken)(jwtPayload, env_config_1.envStrings.ACCESS_TOKEN_SECRET, {
            expiresIn: env_config_1.envStrings.ACCESS_TOKEN_EXPIRE,
        });
        const refreshToken = (0, middleware_util_1.generateToken)(jwtPayload, env_config_1.envStrings.REFRESH_TOKEN_SECRET, {
            expiresIn: env_config_1.envStrings.REFRESH_TOKEN_EXPIRE,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        throw new App_error_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : "Failed to generate tokens");
    }
};
exports.userTokens = userTokens;
