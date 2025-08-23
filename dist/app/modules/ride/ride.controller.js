"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveDrivers = exports.ratingOwnRide = exports.requestRide = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ride_service_1 = require("./ride.service");
exports.requestRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const location = req.userLocation;
    if (!location) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Maybe you are not giving me your location!");
    }
    const user = req.user;
    const activeDriver = req.activeDriverPayload;
    const { lat, lng, fare } = req.body;
    if (!lat || !lng) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Pickup location or destination missing");
    }
    ;
    const response = await (0, ride_service_1.requestRideService)(location, user, lat, lng, fare);
    if (!response && !user && !location) {
        (0, controller_util_1.responseFunction)(res, {
            message: `something wrong while requesting a ride!!`,
            statusCode: http_status_codes_1.default.OK,
            data: null
        });
    }
    (0, controller_util_1.responseFunction)(res, {
        message: `successfully requested the ride now you have confirm the ride with the fare`,
        statusCode: http_status_codes_1.default.OK,
        data: response,
    });
});
exports.ratingOwnRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const rideId = req.params?.id;
    const body = req.body;
    if (!user || !rideId || !body) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Required user, body, rideId!!");
    }
    const ratings = await (0, ride_service_1.ratingRideService)(user, rideId, body);
    (0, controller_util_1.responseFunction)(res, {
        message: "Ratings oka!!",
        statusCode: http_status_codes_1.default.ACCEPTED,
        data: ratings
    });
});
exports.getActiveDrivers = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Required user");
    }
    // Find all online drivers and populate driver info
    const activeDrivers = await user_model_1.User.find({ isOnline: true, isBlocked: false, role: user_interface_1.UserRole.DRIVER }, { location: 1, username: 1, _id: 1, name: 1, email: 1, isOnline: 1 }).populate({
        path: "driver",
        select: "driverStatus isApproved vehicleInfo rating _id driver",
    }).lean();
    // console.log(activeDrivers)
    (0, controller_util_1.responseFunction)(res, {
        message: "Active drivers retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        data: activeDrivers,
    });
});
