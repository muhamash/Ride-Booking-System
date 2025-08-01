import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { User } from "../modules/user/user.model";
import { isAllowedToUpdate } from "../utils/middleware.util";

export const checkUpdatePermission = async (
    req: Request,
    res: Response,
    next: NextFunction
) =>
{
    // console.log("calling the middleware")
    const currentRole = req.user.role as string;
    const currentUserId = req.user.userId as string;
    const targetUserId = req.params.id as string;

    // Find target user
    const targetUser = await User.findById( targetUserId );
    // console.log( "target user", targetUser );
    
    if ( !targetUser )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found!" );
    }

    const targetRole = targetUser.role;

    const allowed = isAllowedToUpdate( currentRole, currentUserId, targetRole, targetUserId );

    if ( !allowed )
    {
        throw new AppError(httpStatus.FORBIDDEN, `You are not allowed to update this user!`)
    }

    // Attach target user
    req.targetUser = targetUser;

    next();
};