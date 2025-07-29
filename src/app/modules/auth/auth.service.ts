import httpStatus from 'http-status-codes';
import { envStrings } from '../../../config/env.config';
import { AppError } from '../../../config/errors/App.error';
import { verifyToken } from '../../utils/middleware.util';
import { userTokens } from '../../utils/service.util';
import { User } from '../user/user.model';

export const userLogoutService = async ( userId: string ) => {
    // console.log("Logging out user with ID:", userId);
    
    const user = await User.findByIdAndUpdate(
        userId,
        { isOnline: false },
        { new: true }
    ).lean();   

    if ( !user ) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // console.log("User logged out successfully:", user);
    return user;
};

export const getNewAccessTokenService = async ( refreshToken: string ) =>
{
    
    const refreshTokenVerify = verifyToken( refreshToken, envStrings.REFRESH_TOKEN_SECRET as string );

    const user = await User.findOne( { email: refreshTokenVerify.email } );

    if ( !user )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found!!" );
    }

    if ( user.isOnline && !user.isBlocked )
    {
        const { accessToken, refreshToken } = await userTokens( user );
        
        return { accessToken, refreshToken }
    }
    else
    {
        throw new AppError( httpStatus.CONFLICT, "Error in new token service!!" )
    }
};