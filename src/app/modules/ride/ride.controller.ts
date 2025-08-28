import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { QueryBuilder } from "../../utils/db/queybuilder.util";
import { ILocation, UserRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { Ride } from "./ride.model";
import { ratingRideService, requestRideService } from "./ride.service";


export const requestRide = asyncHandler( async ( req: Request, res: Response ) =>
{
    let location : ILocation = req.userLocation;
    
    if ( !location )
    {
        location = {
            coordinates: [ req.body.picLat, req.body.picLng ],
            type: 'Point',
            address: "Default address!"
        }
    }

    // console.log( location, req.body )

    const user = req.user as any;
    const activeDriver = req.activeDriverPayload;
    const { lat, lng, fare } = req.body;
    
    
    if ( !lat || !lng) {
        throw new AppError(httpStatus.BAD_REQUEST, "DropOff location or destination missing");
    };

    const response = await requestRideService( user, lat, lng, fare, location );

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

export const getActiveDrivers = asyncHandler( async ( req: Request, res: Response ) =>
{
    const user = req.user;

    if ( !user )
    {
        throw new AppError( httpStatus.EXPECTATION_FAILED, "Required user" );
    }

    // Find all online drivers and populate driver info
    const activeDrivers = await User.find(
        { isOnline: true, isBlocked: false, role: UserRole.DRIVER },
        { location: 1, username: 1, _id: 1, name: 1, email: 1, isOnline: 1 }
    ).populate( {
        path: "driver",
        select: "driverStatus isApproved vehicleInfo rating _id driver",
    } ).lean();

    // console.log(activeDrivers)

    responseFunction( res, {
        message: "Active drivers retrieved successfully",
        statusCode: httpStatus.OK,
        data: activeDrivers,
    } );
} );

export const getUserRides = asyncHandler( async ( req: Request, res: Response ) =>
{
    const role = req.user?.role;
    const userId = req.user?.userId; 
    const query = req.query as Record<string, string>;

    let ridesQuery;

    if ( role === UserRole.DRIVER )
    {
        ridesQuery = new QueryBuilder( Ride.find( { driver: userId } ), query );
    } else
    {
        ridesQuery = new QueryBuilder( Ride.find( { rider: userId } ), query );
    }

    ridesQuery
        .searchableField( [ "riderUserName", "driverUserName", "status" ] )
        .filter( [ "status" ] )
        .sort()
        .fields()
        .pagination();

    const [ ridesData, meta ] = await Promise.all( [
        ridesQuery.modelQuery.exec(),
        ridesQuery.getMeta()
    ] );

    responseFunction( res, {
        message: "Your rides",
        statusCode: httpStatus.OK,
        data: ridesData,
        meta,
    } );
} );