import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { createUserService } from "./user.service";


export const createUser = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{
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

// export const watchMe = asyncHandler( async ( req: Request, res: Response ) =>
// {
    
// } );