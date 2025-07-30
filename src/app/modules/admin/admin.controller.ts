import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import { User } from "../user/user.model";



export const getAllUsers = asyncHandler( async ( req: Request, res: Response ): Promise<void> =>
{

    const users = await User.find().select("-password");

    responseFunction( res, {
        message: "All users retrieved successfully",
        statusCode: httpStatus.OK,
        data: users,
    } );
} );