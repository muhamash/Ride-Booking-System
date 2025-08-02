"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverState = exports.updateVehicleInfo = exports.completeRide = exports.inTransitRide = exports.pickUpRide = exports.cancelRideRequest = exports.acceptRideRequest = exports.checkRideRequest = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const driver_service_1 = require("./driver.service");
exports.checkRideRequest = (0, controller_util_1.asyncHandler)(async (req, res) => {
    // const body = req.body;
    const user = req.user;
    const username = user.username;
    // console.log(user)
    if (!username) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "username got empty!!");
    }
    const ride = await (0, driver_service_1.checkRideRequestService)(username);
    (0, controller_util_1.responseFunction)(res, {
        message: `Found some ride requests!!`,
        statusCode: http_status_codes_1.default.OK,
        data: ride
    });
});
exports.acceptRideRequest = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const rideId = req.params.id;
    const user = req.user;
    const acceptedRide = await (0, driver_service_1.acceptRideRequestService)(rideId, user);
    (0, controller_util_1.responseFunction)(res, {
        message: `Ride accepted!!!`,
        statusCode: http_status_codes_1.default.ACCEPTED,
        data: acceptedRide
    });
});
exports.cancelRideRequest = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const rideId = req.params.id;
    const user = req.user;
    const cancelRide = await (0, driver_service_1.cancelRideRequestService)(rideId, user);
    (0, controller_util_1.responseFunction)(res, {
        message: `Ride cancelled!!!`,
        statusCode: http_status_codes_1.default.OK,
        data: cancelRide
    });
});
exports.pickUpRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const pickUp = await (0, driver_service_1.pickUpService)(id);
    (0, controller_util_1.responseFunction)(res, {
        message: "Picked up the user!",
        statusCode: http_status_codes_1.default.OK,
        data: pickUp
    });
});
exports.inTransitRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const inTransit = await (0, driver_service_1.inTransitRideService)(id);
    (0, controller_util_1.responseFunction)(res, {
        message: "Picked up the user!",
        statusCode: http_status_codes_1.default.OK,
        data: inTransit
    });
});
exports.completeRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const completedRide = await (0, driver_service_1.completeRideService)(id, user);
    (0, controller_util_1.responseFunction)(res, {
        message: "Picked up the user!",
        statusCode: http_status_codes_1.default.OK,
        data: completedRide
    });
});
// driver self
exports.updateVehicleInfo = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const driverId = req.params.id;
    const body = req.body;
    const updatedVehicle = await (0, driver_service_1.updateVehicleService)(driverId, body);
    if (updatedVehicle) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "failed to update the target vehicle!!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Vehicle updated!!",
        statusCode: http_status_codes_1.default.ACCEPTED,
        data: updatedVehicle
    });
});
exports.driverState = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    const states = await (0, driver_service_1.driverStateService)(userId);
    if (!states) {
        throw new App_error_1.AppError(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Something happened when tried to fetch the driver state!!");
    }
    (0, controller_util_1.responseFunction)(res, {
        message: "Vehicle updated!!",
        statusCode: http_status_codes_1.default.ACCEPTED,
        data: states
    });
});
