"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirection = exports.searchLocation = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_config_1 = require("../../../config/env.config");
const App_error_1 = require("../../../config/errors/App.error");
const controller_util_1 = require("../../utils/controller.util");
exports.searchLocation = (0, controller_util_1.asyncHandler)(async (req, res) => {
    try {
        // console.log( req.userLocation, req.body )
        const userLocation = req.userLocation;
        const { query_text } = req.body;
        if (!query_text) {
            throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Invalid Body");
        }
        //  https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=72fb63788da1470ab0c871c6aaab970c
        // `https://maps-api.pathao.io/v1/location/autocomplete/${ userLocation.coordinates[ 1 ] }/${ userLocation.coordinates[ 0 ] }/${ query_text }`,
        // `https://api.geoapify.com/v1/geocode/search?text=${ query_text }&format=json&apiKey=${envStrings.GEOAPIFY_API_KEY}`,
        //  curl -X GET "https://dev.maps.api.dingi.live/search/all/?token=haripur" -H "accept: application/json" -H "x-api-key: 8ad2645c-ad1f-4492-ab28-efedc7beced2"
        const response = await axios_1.default.get(`https://api.geoapify.com/v1/geocode/search?text=${query_text}&format=json&apiKey=${env_config_1.envStrings.GEOAPIFY_API_KEY}`);
        // const response = await axios.get(
        //     `https://dev.maps.api.dingi.live/search/all/?token=${ query_text }`,
        //     {
        //         headers: {
        //             "accept": "application/json",
        //             "x-api-key": envStrings.DINGI_API_KEY, 
        //         },
        //     }
        // );
        // console.log(response.data)
        const result = response.data;
        // console.log(result)
        (0, controller_util_1.responseFunction)(res, {
            data: result.results,
            message: "search result",
            statusCode: http_status_codes_1.default.OK
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            console.error("Location search error:", error.message);
        }
        else {
            console.error("Location search error: Unknown error", error);
        }
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Location search error");
    }
});
const LOCATIONIQ_API_KEY = env_config_1.envStrings.LOCATIONIQ_API_KEY;
const LOCATIONIQ_BASE_URL = "https://us1.locationiq.com/v1";
exports.getDirection = (0, controller_util_1.asyncHandler)(async (req, res) => {
    try {
        const { profile, coordinates, alternatives, steps, overview } = req.body;
        if (!profile || !coordinates) {
            throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Bad request body for direction");
        }
        const url = `${LOCATIONIQ_BASE_URL}/directions/${profile}/${coordinates}`;
        const response = await axios_1.default.get(url, {
            params: {
                key: LOCATIONIQ_API_KEY,
                alternatives: alternatives || false,
                steps: steps || false,
                overview: overview || "simplified",
            },
        });
        // console.log( response );
        (0, controller_util_1.responseFunction)(res, {
            statusCode: http_status_codes_1.default.OK,
            message: "Route retrieved successfully",
            data: response.data,
        });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("LocationIQ Directions Error:", error.response?.data || error.message);
        }
        else if (error instanceof Error) {
            console.error("LocationIQ Directions Error:", error.message);
        }
        else {
            console.error("LocationIQ Directions Error: Unknown error", error);
        }
        throw new App_error_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Error on destination finding!!");
    }
});
