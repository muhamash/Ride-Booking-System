"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingOwnRide = exports.requestRide = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
const ride_service_1 = require("./ride.service");
exports.requestRide = (0, controller_util_1.asyncHandler)(async (req, res) => {
    const location = req.userLocation;
    const user = req.user;
    const activeDriver = req.activeDriverPayload;
    const { lat, lng } = req.body;
    const response = await (0, ride_service_1.requestRideService)(location, user, activeDriver, lat, lng);
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
