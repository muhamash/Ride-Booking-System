import bcrypt from "bcryptjs";
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import { envStrings } from '../../../config/env.config';
import { AppError } from "../../../config/errors/App.error";
import { Driver } from '../driver/driver.model';
import { VehicleInfo } from "../driver/river.interface";
import { IUser, UserRole } from './user.interface';
import { User } from "./user.model";

export const createUserService = async ( payload: IUser ) =>
{
    const session = await mongoose.startSession();
    await session.startTransaction();

    const { email, ...rest } = payload;

    const existingUser = await User.findOne( { email } ).session( session );
    if ( existingUser )
    {
        throw new AppError( httpStatus.CONFLICT, "User already exists with this email" );
    }

    const userDocs = await User.create( [ { email, ...rest } ], { session } );
    const createdUser = userDocs[ 0 ].toObject();
    delete createdUser.password;

    let createdDriver = null;

    if ( createdUser.role === UserRole.DRIVER )
    {
        const driverDocs = await Driver.create( [ {
            user: createdUser._id,
            username: createdUser.username,
            vehicleInfo: payload.vehicleInfo as VehicleInfo,
        } ], { session } );

        if ( !driverDocs?.length )
        {
            throw new AppError( httpStatus.EXPECTATION_FAILED, "Failed to create driver" );
        }

        // Link the driver to the user
        const updatedUser = await User.findByIdAndUpdate(
            createdUser._id,
            { driver: driverDocs[ 0 ]._id },
            { new: true, session }
        ).populate( { path: "driver", select: "-password" } );

        createdDriver = updatedUser?.toObject();
        delete createdDriver.password;
    }

    await session.commitTransaction();
    session.endSession();

    return createdUser.role === UserRole.DRIVER
        ? createdDriver
        : createdUser;
};

export const getUserByIdService = async (userId: string): Promise<IUser | null> =>
{
    // console.log("Fetching user by ID:", userId);
    const user = await User.findById(userId).select("-password").populate("driver").lean();
    
    if ( !user )
    {
        // console.log("User not found with ID:", userId);
        throw new AppError(httpStatus.NOT_FOUND, "User not found" );
    }

    return user;
}

export const updateUserService = async ( userId: string, payload: Partial<IUser> ) =>
{
    if ( payload.password )
    {
        payload.password = await bcrypt.hash( payload.password, envStrings.BCRYPT_SALT );
    }

    const newUpdatedUser = await User.findByIdAndUpdate( userId, payload, { new: true, runValidators: true } ).lean();

    delete newUpdatedUser?.password;

    return newUpdatedUser;
}