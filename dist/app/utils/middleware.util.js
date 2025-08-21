"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedToUpdate = exports.generateRandomDhakaLocations = exports.verifyToken = exports.generateToken = exports.isZodError = void 0;
exports.parseZodError = parseZodError;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const App_error_1 = require("../../config/errors/App.error");
const user_interface_1 = require("../modules/user/user.interface");
const isZodError = (error) => {
    return error && typeof error === "object" && "issues" in error && Array.isArray(error.issues);
};
exports.isZodError = isZodError;
function parseZodError(error) {
    if (!(error instanceof zod_1.ZodError))
        return [];
    const formatted = error.format();
    const issues = [];
    for (const key in formatted) {
        if (key === "_errors")
            continue;
        const fieldErrors = formatted[key]?._errors;
        if (fieldErrors && fieldErrors.length > 0) {
            fieldErrors.forEach((msg) => {
                issues.push({
                    field: key,
                    message: msg,
                });
            });
        }
    }
    return issues;
}
;
const generateToken = (payload, secret, options) => {
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    const verifiedToken = jsonwebtoken_1.default.verify(token, secret);
    if (verifiedToken) {
        return verifiedToken;
    }
    else {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Error in verify token`);
    }
};
exports.verifyToken = verifyToken;
const generateRandomDhakaLocations = async () => {
    const count = 200;
    const centerLat = 23.8103;
    const centerLng = 90.4125;
    const maxOffset = 0.01;
    const locations = [];
    for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() - 0.5) * maxOffset * 2;
        const lngOffset = (Math.random() - 0.5) * maxOffset * 2;
        const lat = parseFloat((centerLat + latOffset).toFixed(6));
        const lng = parseFloat((centerLng + lngOffset).toFixed(6));
        locations.push({
            lat,
            lng,
        });
    }
    const randomIndex = Math.floor(Math.random() * count);
    return locations[randomIndex];
};
exports.generateRandomDhakaLocations = generateRandomDhakaLocations;
const isAllowedToUpdate = (currentRole, currentUserId, targetRole, targetUserId) => {
    if (currentRole === user_interface_1.UserRole.ADMIN) {
        if (targetRole === user_interface_1.UserRole.ADMIN && targetUserId !== currentUserId) {
            return false;
        }
        return true;
    }
    if ([user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER].includes(currentRole)) {
        return currentUserId === targetUserId;
    }
    return false;
};
exports.isAllowedToUpdate = isAllowedToUpdate;
