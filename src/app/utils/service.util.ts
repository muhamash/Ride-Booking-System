import httpStatus from 'http-status-codes';
import { envStrings } from "../../config/env.config";
import { AppError } from "../../config/errors/App.error";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./middleware.util";

export const userTokens = async ( user: Partial<IUser> ) =>
{
    const jwtPayload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
    };

    // console.log(jwtPayload, user)

    try
    {
        const accessToken = generateToken( jwtPayload, envStrings.ACCESS_TOKEN_SECRET as string, {
            expiresIn: envStrings.ACCESS_TOKEN_EXPIRE
        } );

        const refreshToken = generateToken( jwtPayload, envStrings.REFRESH_TOKEN_SECRET as string, {
            expiresIn: envStrings.REFRESH_TOKEN_EXPIRE
        } );

        return {
            accessToken,
            refreshToken
        }
    }
    catch ( error: unknown )
    {
        throw new AppError( httpStatus.INTERNAL_SERVER_ERROR, error as string || "Failed to generate tokens" );
    }
};