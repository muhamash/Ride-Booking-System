"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessToken = exports.userLogout = exports.userLogin = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const service_util_1 = require("../../utils/service.util");
const auth_service_1 = require("./auth.service");
exports.userLogin = (0, controller_util_1.asyncHandler)(async (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, async (error, user, info) => {
        if (error) {
            console.error("Authentication error:", error);
            return next(new App_error_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, typeof error === 'string' ? error : 'Authentication failed'));
        }
        if (!user) {
            return next(new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, info?.message || "Unauthorized"));
        }
        const loginData = await (0, service_util_1.userTokens)(user);
        await (0, controller_util_1.setCookie)(res, "refreshToken", loginData.refreshToken, 4 * 60 * 60 * 1000);
        await (0, controller_util_1.setCookie)(res, "accessToken", loginData.accessToken, 7 * 24 * 60 * 1000);
        const responseData = user?.toObject();
        delete responseData.password;
        (0, controller_util_1.responseFunction)(res, {
            message: "User logged in successfully",
            statusCode: http_status_codes_1.default.ACCEPTED,
            data: {
                email: user?.email,
                userId: user?._id,
                user: responseData,
            },
        });
    })(req, res, next);
});
exports.userLogout = (0, controller_util_1.asyncHandler)(async (req, res) => {
    await (0, controller_util_1.setCookie)(res, "refreshToken", "", 0);
    await (0, controller_util_1.setCookie)(res, "accessToken", "", 0);
    console.log(req.user);
    if (!req.user?.userId) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User ID not found in request");
    }
    await (0, auth_service_1.userLogoutService)(req.user.userId);
    (0, controller_util_1.responseFunction)(res, {
        message: "User logged out successfully",
        statusCode: http_status_codes_1.default.OK,
        data: null,
    });
});
exports.getNewAccessToken = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Cookies or user not found!!");
    }
    const tokenInfo = await (0, auth_service_1.getNewAccessTokenService)(refreshToken);
    if (!tokenInfo) {
        throw new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Invalid refresh token or user not found!!");
    }
    if (tokenInfo.refreshToken && tokenInfo.accessToken) {
        await (0, controller_util_1.setCookie)(res, "refreshToken", tokenInfo.refreshToken, 4 * 60 * 60 * 1000);
        await (0, controller_util_1.setCookie)(res, "accessToken", tokenInfo.accessToken, 7 * 24 * 60 * 1000);
        (0, controller_util_1.responseFunction)(res, {
            message: `New tokens created!!`,
            statusCode: http_status_codes_1.default.CREATED,
            data: tokenInfo,
        });
    }
    else {
        throw new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Error in creating new tokens!!");
    }
});
