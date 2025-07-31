import httpStatus from 'http-status-codes';
import { AppError } from '../../../config/errors/App.error';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { getAllDriversServices, getAllUsersService, getDriverByIdService, getUserByIdService } from './admin.service';


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

export const suspendDriverById = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
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