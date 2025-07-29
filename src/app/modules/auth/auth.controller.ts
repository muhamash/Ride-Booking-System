import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import passport from "passport";
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction, setCookie } from "../../utils/controller.util";
import { userTokens } from "../../utils/service.util";

export const userLogin = asyncHandler( async ( req: Request, res: Response, next: NextFunction ) =>
{

    passport.authenticate( "local", { session: false }, async ( error, user: IUser, info: unknown ) =>
    {
        if ( error )
        {
            return next( new AppError( httpStatus.INTERNAL_SERVER_ERROR, error as string ) );
        }

        if ( !user )
        {
            return next( new AppError( httpStatus.UNAUTHORIZED, info?.message || "Unauthorized" ) );
        }

        const loginData = await userTokens( user );

        await setCookie( res, "refreshToken", loginData.refreshToken, 240 * 60 * 60 * 1000 );
        await setCookie( res, "accessToken", loginData.accessToken, 100 * 60 * 1000 );

        const responseData = user.toObject();
        delete responseData.password;

        responseFunction( res, {
            message: "User logged in successfully",
            statusCode: httpStatus.ACCEPTED,
            data: {
                email: user.email,
                // accessToken: loginData.accessToken,
                // refreshToken: loginData.refreshToken,
                userId: user._id,
                // expiresIn: 300000,
                user:  responseData,
            },
        } );
    } )( req, res, next );
} );