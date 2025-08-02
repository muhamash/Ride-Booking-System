"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewAccessTokenService = exports.userLogoutService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("../../../config/env.config");
const App_error_1 = require("../../../config/errors/App.error");
const middleware_util_1 = require("../../utils/middleware.util");
const service_util_1 = require("../../utils/service.util");
const driver_model_1 = require("../driver/driver.model");
const river_interface_1 = require("../driver/river.interface");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const userLogoutService = async (userId) => {
    // console.log("Logging out user with ID:", userId);
    const user = await user_model_1.User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(userId), { isOnline: false }, { new: true });
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role === user_interface_1.UserRole.DRIVER) {
        await driver_model_1.Driver.findOneAndUpdate({ user: user._id }, { $set: { driverStatus: river_interface_1.DriverStatus.UNAVAILABLE } }, { new: true });
    }
    // console.log("User logged out successfully:", user);
    return user;
};
exports.userLogoutService = userLogoutService;
const getNewAccessTokenService = async (refreshToken) => {
    const refreshTokenVerify = (0, middleware_util_1.verifyToken)(refreshToken, env_config_1.envStrings.REFRESH_TOKEN_SECRET);
    const user = await user_model_1.User.findOneAndUpdate({ email: refreshTokenVerify?.email }, { $set: { lastOnlineAt: new Date() } }, { new: true });
    // console.log(user, refreshTokenVerify)
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found!!");
    }
    if (user.isOnline && !user.isBlocked) {
        const { accessToken, refreshToken } = await (0, service_util_1.userTokens)(user);
        return { accessToken, refreshToken };
    }
    else {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, "Error in new token service!!");
    }
};
exports.getNewAccessTokenService = getNewAccessTokenService;
