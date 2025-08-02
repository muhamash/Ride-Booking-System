"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingRideService = exports.requestRideService = void 0;
const haversine_distance_1 = __importDefault(require("haversine-distance"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_error_1 = require("../../../config/errors/App.error");
const helperr_util_1 = require("../../utils/helperr.util");
const driver_model_1 = require("../driver/driver.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const requestRideService = async (pickUpLocation, user, activeDrivers, dropLat, dropLng) => {
    if (!activeDrivers?.length) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "No drivers are online!!");
    }
    if (!pickUpLocation || !dropLat || !dropLng) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Missing data: user location, or destination");
    }
    const riderId = user.userId;
    const isExistRequest = await ride_model_1.Ride.find({
        rider: riderId,
        status: { $eq: ride_interface_1.RideStatus.REQUESTED }
    });
    // console.log(isExistRequest)
    if (isExistRequest.length > 0) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, "You have pending rides on database!!");
    }
    // Get address of the destination
    const dropOffLocationAddress = await (0, helperr_util_1.reverseGeocode)(dropLat, dropLng);
    const dropOffLocation = {
        type: "Point",
        coordinates: [dropLat, dropLng],
        address: dropOffLocationAddress?.displayName || "Unknown",
    };
    // Add distance to each driver
    const enrichedDrivers = activeDrivers.map((driver) => {
        const driverCoords = driver.location.coordinates;
        const riderCoords = pickUpLocation.coordinates;
        const distanceInMeters = (0, haversine_distance_1.default)(riderCoords, driverCoords);
        const distanceInKm = Number((distanceInMeters / 1000).toFixed(2));
        return {
            ...driver,
            distanceInKm,
        };
    });
    // Sort: highest rating first, then closest
    enrichedDrivers?.sort((a, b) => {
        if (b.avgRating !== a.avgRating)
            return b.avgRating - a.avgRating;
        return a.distanceInKm - b.distanceInKm;
    });
    // console.log( enrichedDrivers );
    const matchedDriver = enrichedDrivers[0];
    if (!matchedDriver)
        throw new Error("No available driver found");
    // Estimate fare (simplified example: 50 BDT base + 25/km)
    const estimatedFare = 50 + 25 * matchedDriver.distanceInKm;
    const newRide = await ride_model_1.Ride.create({
        rider: riderId,
        driver: matchedDriver?.driverId,
        pickUpLocation,
        dropOffLocation,
        driverLocation: matchedDriver?.location,
        distanceInKm: matchedDriver?.distanceInKm,
        fare: estimatedFare,
        status: ride_interface_1.RideStatus.REQUESTED,
        requestedAt: new Date(),
        riderUserName: user.username,
        driverUserName: matchedDriver?.username,
    });
    const ride = await ride_model_1.Ride.findById(newRide._id)
        .populate("rider", "name email username")
        .populate("driver", "vehicleInfo rating driverStatus username user");
    return { ride, totalAvailable: enrichedDrivers.length };
};
exports.requestRideService = requestRideService;
const ratingRideService = async (user, rideId, body) => {
    const { rating } = body;
    if (!rating || rating < 1 || rating > 5) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Rating must be between 1 and 5.");
    }
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    }
    console.log(ride, user);
    if (!ride.rider || !user.userId || ride.rider.toString() !== user.userId) {
        throw new App_error_1.AppError(http_status_codes_1.default.FORBIDDEN, "You are not authorized to rate this ride.");
    }
    if (ride.status !== ride_interface_1.RideStatus.COMPLETED) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You can only rate a completed ride.");
    }
    if (ride.rating && ride.rating.rating) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "This ride has already been rated.");
    }
    //  Save rating to ride
    ride.rating = {
        riderId: new mongoose_1.default.Types.ObjectId(user.userId),
        rating,
        rideId: ride._id,
    };
    await ride.save();
    let updatedDriver = null;
    if (ride.driver) {
        const driver = await driver_model_1.Driver.findById(ride.driver);
        if (driver) {
            const oldTotal = driver.rating?.totalRatings || 0;
            const oldAverage = driver.rating?.averageRating || 0;
            const newTotal = oldTotal + 1;
            const newAverage = (oldAverage * oldTotal + rating) / newTotal;
            updatedDriver = await driver_model_1.Driver.findByIdAndUpdate(driver._id, {
                $set: {
                    "rating.averageRating": newAverage,
                    "rating.totalRatings": newTotal,
                },
                $push: {
                    "rating.ratings": {
                        riderId: new mongoose_1.default.Types.ObjectId(user.userId),
                        rating,
                        rideId: ride._id,
                    },
                },
            }, { new: true });
        }
    }
    return {
        rideRating: ride.rating,
        driverRating: updatedDriver?.rating ?? null,
    };
};
exports.ratingRideService = ratingRideService;
