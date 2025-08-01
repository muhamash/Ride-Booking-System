import httpStatus from 'http-status-codes';
import { envStrings } from "../../config/env.config";
import { AppError } from "../../config/errors/App.error";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./middleware.util";

export const userTokens = async ( user: Partial<IUser> ) =>
{
    const jwtPayload = {
        userId: user.user?.id || user.id,
        username: user.username,
        email: user.email || user.user.email,
        role: user.role || user.user.role,
        name: user.name || user.user.name
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

export const haversineDistance = async( coord1: number[], coord2: number[] ): number =>
{
    const toRad = ( deg: number ) => ( deg * Math.PI ) / 180;
    const [ lat1, lon1 ] = coord1;
    const [ lat2, lon2 ] = coord2;

    const R = 6371; 
    const dLat = toRad( lat2 - lat1 );
    const dLon = toRad( lon2 - lon1 );

    const a =
        Math.sin( dLat / 2 ) ** 2 +
        Math.cos( toRad( lat1 ) ) *
        Math.cos( toRad( lat2 ) ) *
        Math.sin( dLon / 2 ) ** 2;

    const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    return R * c; 
};