"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalDriver = exports.deleteRide = exports.deleteBlockedUser = exports.blockUserById = exports.suspendDriverById = exports.getRideById = exports.getAllRides = exports.getDriverById = exports.getUserById = exports.getAllDrivers = exports.getAllUsers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const admin_service_1 = require("./admin.service");
// Controller functions
exports.getAllUsers = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    const users = await (0, admin_service_1.getAllUsersService)(query);
    // console.log(users)
    if (!users?.data || !Array.isArray(users.data) || users.data.length === 0) {
        throw new App_error_1.AppError(http_status_codes_1.default.OK, "User dataset is empty!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "All users retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: users,
    });
});
exports.getAllDrivers = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    const users = await (0, admin_service_1.getAllDriversServices)(query);
    if (!users?.data || !Array.isArray(users.data) || users.data.length === 0) {
        throw new App_error_1.AppError(http_status_codes_1.default.OK, "Driver dataset is empty!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "All drivers retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: users,
    });
});
exports.getUserById = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const user = await (0, admin_service_1.getUserByIdService)(userId);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "User retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.getDriverById = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const user = await (0, admin_service_1.getDriverByIdService)(userId);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Driver retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.getAllRides = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const query = req.query;
    const rides = await (0, admin_service_1.allRideService)(query);
    if (!rides?.data || !Array.isArray(rides.data) || rides?.data?.length === 0) {
        throw new App_error_1.AppError(http_status_codes_1.default.OK, "Rides dataset is empty!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "All rides retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: rides,
    });
});
exports.getRideById = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const rideId = req.params.id;
    const ride = await (0, admin_service_1.getRideByIdService)(rideId);
    if (!ride) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Ride retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: ride,
    });
});
exports.suspendDriverById = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params?.id;
    const param = req.params?.suspendParam;
    const user = await (0, admin_service_1.suspendDriverIdService)(userId, param);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Cannot modify the driver!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Driver modified",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.blockUserById = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const param = req.params?.blockParam;
    const user = await (0, admin_service_1.blockUserByIdService)(userId, param);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "User modified",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.deleteBlockedUser = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const user = await (0, admin_service_1.deleteBlockedUserService)(userId);
    (0, controller_util_1.responseFunction)(res, {
        message: "User deleted successfully",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.deleteRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const rideId = req.params.id;
    const ride = await (0, admin_service_1.deleteRideService)(rideId);
    (0, controller_util_1.responseFunction)(res, {
        message: "Ride deleted successfully",
        statusCode: http_status_codes_1.default.OK,
        data: ride,
    });
});
exports.approvalDriver = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const param = req.params?.approveParam;
    const user = await (0, admin_service_1.approveDriverService)(userId, param);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Something went wrong during driver approval");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Modified request!",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
