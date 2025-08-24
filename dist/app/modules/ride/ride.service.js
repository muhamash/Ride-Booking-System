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
const river_interface_1 = require("../driver/river.interface");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const requestRideService = async (pickUpLocation, user, dropLat, dropLng, fare) => {
    if (!pickUpLocation || !dropLat || !dropLng) {
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Missing data: pickup or destination coordinates");
    }
    // Get all online drivers
    const driversRaw = await user_model_1.User.find({ isOnline: true, role: user_interface_1.UserRole.DRIVER })
        .select("-password username email name location")
        .populate("driver", "driverStatus isApproved vehicleInfo rating _id")
        .lean();
    // Filter available drivers
    const availableDrivers = driversRaw.filter((u) => u.driver?.driverStatus === river_interface_1.DriverStatus.AVAILABLE);
    const activeDrivers = availableDrivers.map((u) => ({
        driverId: u.driver._id.toString(),
        userId: u._id.toString(),
        name: u.name,
        username: u.username,
        email: u.email,
        location: u.location,
        isApproved: u.driver.isApproved,
        avgRating: u.driver.rating?.averageRating || 0,
        vehicleInfo: u.driver.vehicleInfo || {},
    }));
    if (!activeDrivers.length) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "No drivers are online!");
    }
    // Check if the user already has a pending ride
    const existingRide = await ride_model_1.Ride.find({
        rider: user.userId,
        status: ride_interface_1.RideStatus.REQUESTED,
    });
    if (existingRide.length > 0) {
        throw new App_error_1.AppError(http_status_codes_1.default.CONFLICT, "You have pending rides!");
    }
    // Get destination address
    const dropOffAddress = await (0, helperr_util_1.reverseGeocode)(dropLat, dropLng);
    const dropOffLocation = {
        type: "Point",
        coordinates: [dropLat, dropLng],
        address: dropOffAddress?.displayName || "Unknown",
    };
    // Calculate distance from pickup to each driver
    const enrichedDrivers = activeDrivers.map((driver) => {
        const distanceInMeters = (0, haversine_distance_1.default)(pickUpLocation.coordinates, driver.location.coordinates);
        const distanceInKm = Number((distanceInMeters / 1000).toFixed(2));
        return { ...driver, distanceInKm };
    });
    // Sort: highest rating first, then closest
    enrichedDrivers.sort((a, b) => {
        if (b.avgRating !== a.avgRating)
            return b.avgRating - a.avgRating;
        return (a.distanceInKm || 0) - (b.distanceInKm || 0);
    });
    const matchedDriver = enrichedDrivers[0];
    if (!matchedDriver)
        throw new App_error_1.AppError(http_status_codes_1.default.NOT_FOUND, "No available driver found");
    // // Estimate fare: 50 BDT base + 25/km
    // const estimatedFare = 50 + 25 * ( matchedDriver.distanceInKm || 0 );
    // Create ride
    const newRide = await ride_model_1.Ride.create({
        rider: user.userId,
        driver: matchedDriver.driverId,
        pickUpLocation,
        dropOffLocation,
        driverLocation: matchedDriver.location,
        distanceInKm: matchedDriver.distanceInKm,
        fare,
        status: ride_interface_1.RideStatus.REQUESTED,
        requestedAt: new Date(),
        riderUserName: user.username,
        driverUserName: matchedDriver.username,
    });
    const ride = await ride_model_1.Ride.findById(newRide._id)
        .populate("rider", "name email username")
        .populate("driver", "vehicleInfo rating driverStatus username");
    return { ride, totalAvailable: enrichedDrivers?.length };
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
