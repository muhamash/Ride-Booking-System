import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { User } from "./user.model";

export const createUserService = async (payload: Partial<IUser>) =>
{
    const { email, ...rest } = payload;

    // console.log("Creating user with payload:", payload);

    const existingUser = await User.findOne({ email });
    if ( existingUser )
    {
        // console.log("User already exists with email:", existingUser);
        throw new AppError(httpStatus.CONFLICT, "User already exists with this email" );
    }

    const user = await User.create( { email, ...rest } );

    const createdUser = user.toObject();
    delete createdUser.password;

    // console.log(createdUser, user)
    return createdUser;
}