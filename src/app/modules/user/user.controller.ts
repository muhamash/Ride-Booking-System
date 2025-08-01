import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { createUserService, getUserByIdService, updateUserService } from "./user.service";


export const createUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    // console.log(req.userLocation)
    const user = await createUserService( req.body );

    if ( !user )
    {
        responseFunction( res, {
            message: `Something went wrong when creating the user`,
            statusCode: httpStatus.EXPECTATION_FAILED,
            data: null,
        } );

        return;
    }

    responseFunction( res, {
        message: `User created!!`,
        statusCode: httpStatus.CREATED,
        data: user,
    } );
} );

export const getMe = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    const user = await getUserByIdService( req.user?.userId );

    responseFunction( res, {
        message: "User retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );


export const updateUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    if ( !req.params.id )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "No userId detected!!" )
    }

    const user = await updateUserService( req.params.id, req.body );

    if ( !user )
    {
        throw new AppError( httpStatus.EXPECTATION_FAILED, "Failed to update the user" )
    }

    responseFunction( res,
        {
            message: "User successfully updated!!",
            statusCode: httpStatus.OK,
            data: user,
        }
    )
} );