import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { ratingRideService, requestRideService } from "./ride.service";


export const requestRide = asyncHandler( async ( req: Request, res: Response ) =>
{
    const location = req.userLocation;

    if ( !location )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Maybe you are not giving me your location!")
    }

    const user = req.user;
    const activeDriver = req.activeDriverPayload;
    const { lat, lng } = req.body;
    
    if ( !lat || !lng) {
        throw new AppError(httpStatus.BAD_REQUEST, "Pickup location or destination missing");
    };

    const response = await requestRideService( location, user, lat, lng );

    if ( !response && !user && !location )
    {
        responseFunction( res, {
        message: `something wrong while requesting a ride!!`,
        statusCode: httpStatus.OK,
        data: null
    } );
    }

    responseFunction( res, {
        message: `successfully requested the ride now you have confirm the ride with the fare`,
        statusCode: httpStatus.OK,
        data: response,

    } );
} );

export const ratingOwnRide = asyncHandler( async ( req: Request, res: Response ) =>
{
    const user = req.user;
    const rideId = req.params?.id;
    const body = req.body;

    if ( !user || !rideId || !body )
    {
        throw new AppError(httpStatus.EXPECTATION_FAILED, "Required user, body, rideId!!")
    }

    const ratings = await ratingRideService( user, rideId, body );

    responseFunction( res, {
        message: "Ratings oka!!",
        statusCode: httpStatus.ACCEPTED,
        data: ratings
    })

} );