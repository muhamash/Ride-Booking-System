"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackLocationByLatLng = void 0;
const controller_util_1 = require("../utils/controller.util");
const helperr_util_1 = require("../utils/helperr.util");
const middleware_util_1 = require("../utils/middleware.util");
exports.trackLocationByLatLng = (0, controller_util_1.asyncHandler)(async (req, res, next) => {
    const { lat, lng } = await (0, middleware_util_1.generateRandomDhakaLocations)();
    if (!lat || !lng)
        return next();
    // Convert to numbers safely
    const latNum = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    if (isNaN(latNum) || isNaN(lngNum))
        return next();
    const geo = await (0, helperr_util_1.reverseGeocode)(latNum, lngNum);
    if (geo) {
        const locationPayload = {
            type: 'Point',
            coordinates: [lngNum, latNum],
            address: geo.displayName
        };
        req.userLocation = locationPayload;
        req.headers["x-user-location"] = JSON.stringify(geo);
    }
    next();
});
