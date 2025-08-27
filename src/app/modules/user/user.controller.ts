import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { createUserService, getUserByIdService, updateUserService } from "./user.service";


export const createUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    // console.log(req.body)
    const user = await createUserService( req.body );

    // console.log(user)

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
    console.log("User me got a hit!")
    if ( !req.user || !( 'userId' in req.user ) )
    {
        throw new AppError( httpStatus.UNAUTHORIZED, "User not authenticated" );
    }
    const userId: any = req.user?.userId;
    const user = await getUserByIdService( userId );

    responseFunction( res, {
        message: "User retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    } );
} );


export const updateUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
    console.log("update user hit")
    const userId = req.params?.id
    if ( !userId )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "No userId detected!!" )
    }

    const user = await updateUserService( userId, req.body );

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

