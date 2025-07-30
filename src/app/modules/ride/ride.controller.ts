import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { requestRideService } from "./ride.service";


export const requestRide = asyncHandler( async ( req: Request, res: Response ) =>
{
    const location = req.userLocation;
    const user = req.user;
    const activeDriver = req.activeDriverPayload;

    const response = await requestRideService( location, user, activeDriver );

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
        data: response
    } );
});