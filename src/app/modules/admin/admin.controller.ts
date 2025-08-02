import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { AppError } from '../../../config/errors/App.error';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import
    {
        allRideService,
        approveDriverService,
        blockUserByIdService,
        deleteBlockedUserService,
        deleteRideService,
        getAllDriversServices,
        getAllUsersService,
        getDriverByIdService,
        getRideByIdService,
        getUserByIdService,
        suspendDriverIdService
    } from './admin.service';
import { approvalParam, blockParam } from './admin.type';

// Interface definitions
interface IdParam {
    id: string;
}

interface RideParams extends IdParam {}

interface SuspendDriverParams extends IdParam {
    suspendParam: string;
}

interface BlockUserParams extends IdParam {
    blockParam: string;
}

interface ApprovalDriverParams extends IdParam {
    approveParam: string;
}

// Extend Express Request types
declare module 'express' {
    interface Request {
        query: any;
        params: IdParam | RideParams | SuspendDriverParams | BlockUserParams | ApprovalDriverParams;
    }
}

// Controller functions
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await getAllUsersService(req.query);

    if (!users.data.length) {
        throw new AppError(httpStatus.OK, "User dataset is empty!");
    }

    responseFunction(res, {
        message: "All users retrieved successfully",
        statusCode: httpStatus.OK,
        data: users,
    });
});

export const getAllDrivers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await getAllDriversServices(req.query);

    if (!users.data.length) {
        throw new AppError(httpStatus.OK, "Driver dataset is empty!");
    }

    responseFunction(res, {
        message: "All drivers retrieved successfully",
        statusCode: httpStatus.OK,
        data: users,
    });
});

export const getUserById = asyncHandler(async (req: Request<IdParam>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const user = await getUserByIdService(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    responseFunction(res, {
        message: "User retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    });
});

export const getDriverById = asyncHandler(async (req: Request<IdParam>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const user = await getDriverByIdService(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
    }

    responseFunction(res, {
        message: "Driver retrieved successfully",
        statusCode: httpStatus.OK,
        data: user,
    });
});

export const getAllRides = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const rides = await allRideService(req.query);

    if (!rides.data.length) {
        throw new AppError(httpStatus.OK, "Rides dataset is empty!");
    }

    responseFunction(res, {
        message: "All rides retrieved successfully",
        statusCode: httpStatus.OK,
        data: rides,
    });
});

export const getRideById = asyncHandler(async (req: Request<RideParams>, res: Response): Promise<void> => {
    const rideId = req.params.id;
    const ride = await getRideByIdService(rideId);

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
    }

    responseFunction(res, {
        message: "Ride retrieved successfully",
        statusCode: httpStatus.OK,
        data: ride,
    });
});

export const suspendDriverById = asyncHandler(async (req: Request<SuspendDriverParams>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const param = req.params.suspendParam;
    const user = await suspendDriverIdService(userId, param);

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot modify the driver!");
    }

    responseFunction(res, {
        message: "Driver modified",
        statusCode: httpStatus.OK,
        data: user,
    });
});

export const blockUserById = asyncHandler(async (req: Request<BlockUserParams>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const param: blockParam = req.params.blockParam;
    const user = await blockUserByIdService(userId, param);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    responseFunction(res, {
        message: "User modified",
        statusCode: httpStatus.OK,
        data: user,
    });
});

export const deleteBlockedUser = asyncHandler(async (req: Request<IdParam>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const user = await deleteBlockedUserService(userId);

    responseFunction(res, {
        message: "User deleted successfully",
        statusCode: httpStatus.OK,
        data: user,
    });
});

export const deleteRide = asyncHandler(async (req: Request<RideParams>, res: Response): Promise<void> => {
    const rideId = req.params.id;
    const ride = await deleteRideService(rideId);

    responseFunction(res, {
        message: "Ride deleted successfully",
        statusCode: httpStatus.OK,
        data: ride,
    });
});

export const approvalDriver = asyncHandler(async (req: Request<ApprovalDriverParams>, res: Response): Promise<void> => {
    const userId = req.params.id;
    const param: approvalParam = req.params.approveParam;
    const user = await approveDriverService(userId, param);

    if (!user) {
        throw new AppError(httpStatus.EXPECTATION_FAILED, "Something went wrong during driver approval");
    }

    responseFunction(res, {
        message: "Modified request!",
        statusCode: httpStatus.OK,
        data: user,
    });
});