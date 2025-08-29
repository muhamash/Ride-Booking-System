"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.updateUser = exports.getMe = exports.createUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("./user.model");
const user_service_1 = require("./user.service");
exports.createUser = (0, controller_util_1.asyncHandler)(async (req, res) => {
    // console.log(req.body)
    const user = await (0, user_service_1.createUserService)(req.body);
    // console.log(user)
    if (!user) {
        (0, controller_util_1.responseFunction)(res, {
            message: `Something went wrong when creating the user`,
            statusCode: http_status_codes_1.default.EXPECTATION_FAILED,
            data: null,
        });
        return;
    }
    (0, controller_util_1.responseFunction)(res, {
        message: `User created!!`,
        statusCode: http_status_codes_1.default.CREATED,
        data: user,
    });
});
exports.getMe = (0, controller_util_1.asyncHandler)(async (req, res) => {
    // console.log("User me got a hit!")
    if (!req.user || !('userId' in req.user)) {
        throw new App_error_1.AppError(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const userId = req.user?.userId;
    const user = await (0, user_service_1.getUserByIdService)(userId);
    (0, controller_util_1.responseFunction)(res, {
        message: "User retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.updateUser = (0, controller_util_1.asyncHandler)(async (req, res) => {
    console.log("update user hit");
    const userId = req.params?.id;
    if (!userId) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "No userId detected!!");
    }
    const user = await (0, user_service_1.updateUserService)(userId, req.body);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Failed to update the user");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "User successfully updated!!",
        statusCode: http_status_codes_1.default.OK,
        data: user,
    });
});
exports.getUserStats = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found!!");
    }
    const rides = await ride_model_1.Ride.find({ rider: user._id }).populate("driver");
    if (!rides) {
        throw new App_error_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to fetch rides for user");
    }
    const completedRides = rides.filter(ride => ride.status === "COMPLETED");
    const totalSpent = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    const totalRides = completedRides.length;
    const totalTravelledInKm = completedRides.reduce((sum, ride) => sum + (ride.distanceInKm || 0), 0);
    const recentRides = rides
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
        .slice(0, 3);
    const stats = {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isOnline: user.isOnline,
        },
        rides: recentRides,
        totalSpent,
        totalRides,
        totalTravelledInKm,
    };
    (0, controller_util_1.responseFunction)(res, {
        message: "User stats fetched successfully!",
        statusCode: http_status_codes_1.default.OK,
        data: stats,
    });
});
