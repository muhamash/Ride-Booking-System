"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverStateService = exports.updateVehicleService = exports.completeRideService = exports.inTransitRideService = exports.pickUpService = exports.cancelRideRequestService = exports.acceptRideRequestService = exports.checkRideRequestService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_error_1 = require("../../../config/errors/App.error");
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const river_interface_1 = require("./river.interface");
const checkRideRequestService = async (username) => {
    // console.log(userId)
    if (!username) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Wrong username");
    }
    const findRide = await ride_model_1.Ride.find({ driverUserName: username, status: ride_interface_1.RideStatus.REQUESTED });
    if (findRide.length < 1) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "No Ride exists!!");
    }
    return { rides: findRide, total: findRide.length };
};
exports.checkRideRequestService = checkRideRequestService;
const acceptRideRequestService = async (rideId, user) => {
    if (!rideId && !user) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "rider id or user not found at the request body");
    }
    const searchRide = await ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.REQUESTED
    });
    if (!searchRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found or ride is been expired!!");
    }
    if (searchRide.status === ride_interface_1.RideStatus.CANCELLED) {
        throw new App_error_1.AppError(http_status_codes_1.default.NON_AUTHORITATIVE_INFORMATION, "Ride already cancelled!!");
    }
    const acceptedRide = await ride_model_1.Ride.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(rideId) }, { $set: { status: ride_interface_1.RideStatus.ACCEPTED, acceptedAt: Date.now(), expiresAt: null } }, { new: true });
    if (acceptedRide.status === ride_interface_1.RideStatus.ACCEPTED) {
        await driver_model_1.Driver.findOneAndUpdate({ username: user.username }, { $set: { driverStatus: river_interface_1.DriverStatus.RIDING } }, { new: true });
    }
    console.log(acceptedRide);
    return {
        acceptedRide
    };
};
exports.acceptRideRequestService = acceptRideRequestService;
const cancelRideRequestService = async (rideId, user) => {
    if (!rideId) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "ride id  not found at the request body");
    }
    const searchRide = await ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.REQUESTED
    });
    if (!searchRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found or ride is been expired!!");
    }
    if (searchRide.status === ride_interface_1.RideStatus.CANCELLED) {
        throw new App_error_1.AppError(http_status_codes_1.default.NON_AUTHORITATIVE_INFORMATION, "Ride already cancelled!!");
    }
    const cancelRide = await ride_model_1.Ride.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(rideId) }, { $set: { status: ride_interface_1.RideStatus.CANCELLED, cancelledAt: Date.now(), cancelledBy: user.role, expiresAt: null } }, { new: true });
    console.log(cancelRide);
    return cancelRide;
};
exports.cancelRideRequestService = cancelRideRequestService;
const pickUpService = async (id) => {
    if (!id) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "wrong ride id!!");
    }
    const searchRide = await ride_model_1.Ride.findOne({
        _id: id,
        status: ride_interface_1.RideStatus.ACCEPTED
    });
    if (!searchRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found or ride is been expired!!");
    }
    const pickedUp = await ride_model_1.Ride.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: { status: ride_interface_1.RideStatus.PICKED_UP, pickedUpAt: Date.now() } }, { new: true });
    console.log(pickedUp);
    return pickedUp;
};
exports.pickUpService = pickUpService;
const inTransitRideService = async (id) => {
    if (!id) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "wrong ride id!!");
    }
    const searchRide = await ride_model_1.Ride.findOne({
        _id: id,
        status: ride_interface_1.RideStatus.PICKED_UP
    });
    if (!searchRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found or ride is been expired!!");
    }
    const inTransit = await ride_model_1.Ride.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: { status: ride_interface_1.RideStatus.IN_TRANSIT } }, { new: true });
    console.log(inTransit);
    return inTransit;
};
exports.inTransitRideService = inTransitRideService;
const completeRideService = async (id, user) => {
    if (!id) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "wrong ride id!!");
    }
    const searchRide = await ride_model_1.Ride.findOne({
        _id: id,
        status: ride_interface_1.RideStatus.IN_TRANSIT
    });
    if (!searchRide) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found or ride is been expired!!");
    }
    const completedRide = await ride_model_1.Ride.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: { status: ride_interface_1.RideStatus.COMPLETED, completedAt: Date.now() } }, { new: true });
    if (completedRide?.status === ride_interface_1.RideStatus.COMPLETED) {
        const findDriver = await driver_model_1.Driver.findOne({ username: user.username });
        if (findDriver) {
            await driver_model_1.Driver.findOneAndUpdate({ username: user.username }, { $set: { driverStatus: river_interface_1.DriverStatus.AVAILABLE, totalRides: findDriver.totalRides + 1, totalEarnings: findDriver.totalEarnings + completedRide.fare } }, { new: true });
        }
        else {
            throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Driver not. found!!");
        }
    }
    return completedRide;
};
exports.completeRideService = completeRideService;
const updateVehicleService = async (userId, payload) => {
    const driver = await driver_model_1.Driver.findById(userId);
    if (!driver) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "failed to find the target vehicle!!");
    }
    const updatedDriver = await driver_model_1.Driver.findByIdAndUpdate(driver._id, payload, { new: true, runValidators: true });
    return updatedDriver;
};
exports.updateVehicleService = updateVehicleService;
const driverStateService = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "user not found!!");
    }
    const driver = await driver_model_1.Driver.findOne({ user: user._id });
    if (driver) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, "this user is not a driver!!");
    }
    const rides = await ride_model_1.Ride.find({ driver: driver._id }).populate("driver");
    if (rides.length < 1) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "no ride  found!!");
    }
    return rides;
};
exports.driverStateService = driverStateService;
