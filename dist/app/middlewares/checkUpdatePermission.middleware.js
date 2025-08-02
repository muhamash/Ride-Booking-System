"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdatePermission = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../config/errors/App.error");
const user_model_1 = require("../modules/user/user.model");
const middleware_util_1 = require("../utils/middleware.util");
const checkUpdatePermission = async (req, res, next) => {
    if (!req.user || !('userId' in req.user) || !('role' in req.user)) {
        throw new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "Authentication required");
    }
    const currentRole = req.user.role;
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id;
    // Find target user
    const targetUser = await user_model_1.User.findById(targetUserId);
    if (!targetUser) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    const targetRole = targetUser.role;
    const allowed = (0, middleware_util_1.isAllowedToUpdate)(currentRole, currentUserId.toString(), targetRole, targetUserId);
    if (!allowed) {
        throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, `You are not allowed to update this user!`);
    }
    // Attach target user
    req.targetUser = targetUser;
    next();
};
exports.checkUpdatePermission = checkUpdatePermission;
