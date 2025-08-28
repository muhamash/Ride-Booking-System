"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateFare = exports.generateSlug = void 0;
exports.reverseGeocode = reverseGeocode;
const haversine_distance_1 = __importDefault(require("haversine-distance"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const slugify_1 = __importDefault(require("slugify"));
const App_error_1 = require("../../config/errors/App.error");
const generateSlug = (email, role) => {
    const slugInput = `${email}-${role}`;
    return (0, slugify_1.default)(slugInput, { lower: true, strict: false });
};
exports.generateSlug = generateSlug;
const estimateFare = ({ startLat, startLng, endLat, endLng, durationInMin, }) => {
    const distance = (0, haversine_distance_1.default)({ lat: startLat, lng: startLng }, { lat: endLat, lng: endLng }) / 1000;
    const baseFare = 50;
    const perKm = 20;
    const perMin = 2;
    const totalFare = baseFare + distance * perKm + durationInMin * perMin;
    return {
        distance: Number(distance.toFixed(2)),
        durationInMin,
        estimatedFare: Math.ceil(totalFare),
    };
};
exports.estimateFare = estimateFare;
async function reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "reverse-geo-script"
            }
        });
        const data = await res.json();
        return {
            displayName: data.display_name,
            address: data.address,
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lon),
        };
    }
    catch (error) {
        throw new App_error_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, `Location failed to be fetched!!, ${error}`);
    }
}
;
