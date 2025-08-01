import httpStatus from 'http-status-codes';
import { AppError } from '../../../config/errors/App.error';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { allRideService, blockUserByIdService, deleteBlockedUserService, deleteRideService, getAllDriversServices, getAllUsersService, getDriverByIdService, getRideByIdService, getUserByIdService, suspendDriverIdService } from './admin.service';
import { blockParam } from './admin.type';


export const getAllUsers = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{

    const users = await getAllUsersService(req.query);

    if ( !users.data.length )
    {
        throw new AppError( httpStatus.OK, "driver dataset is empty!" );
    }


    responseFunction( res, {
        message: "All users retrieved successfully",
        statusCode: httpStatus.OK,
        data: users,
    } );
} );

export const getAllDrivers = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{

    const users = await getAllDriversServices(req.query);

    if ( !users.data.length )
    {
        throw new AppError( httpStatus.OK, "driver dataset is empty!" );
    }


    responseFunction( res, {
        message: "All drivers retrieved successfully",
        statusCode: httpStatus.OK,
        data: users,
    } );
} );

export const getUserById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const userId = req.params.id;
    const user = await getUserByIdService(userId);

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    responseFunction( res, {
        message: "User retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );

export const getDriverById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const userId = req.params.id;
    const user = await getDriverByIdService(userId);

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Driver not found" );
    }

    responseFunction( res, {
        message: "Driver retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );

export const getAllRides = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{

    const rides = await allRideService( req.query );

    if ( !rides.data.length )
    {
        throw new AppError( httpStatus.OK, "rides dataset is empty!" );
    }


    responseFunction( res, {
        message: "All rides retrieved successfully",
        statusCode: httpStatus.OK,
        data: rides,
    } );
} );

export const getRideById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const rideId = req.params.id;
    const ride = await getRideByIdService(rideId);

    if ( !ride )
    {
        throw new AppError( httpStatus.NOT_FOUND, "ride not found" );
    }

    responseFunction( res, {
        message: "ride retrieved successfully",
        statusCode: httpStatus.OK,
        data: ride,
    } );
} );

export const suspendDriverById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const userId = req.params.id;
    const user = await suspendDriverIdService(userId);

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    responseFunction( res, {
        message: "Driver  suspended successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );


export const blockUserById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const userId: string = req.params.id;
    const param: blockParam = req.params.blockParam;
    const user = await blockUserByIdService(userId, param);

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    responseFunction( res, {
        message: "User blocked successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );

export const deleteBlockedUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const userId: string = req.params.id;
    const user = await deleteBlockedUserService(userId);

    responseFunction( res, {
        message: "User deleted successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );

export const deleteRide = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const rideId: string = req.params.id;
    const ride = await deleteRideService(rideId);

    responseFunction( res, {
        message: "ride deleted successfully",
        statusCode: httpStatus.OK,
        data: ride,
    } );
} );