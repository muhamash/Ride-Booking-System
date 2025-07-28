/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler, responseFunction } from "../../utils/controller.util";

export const homeRoute = asyncHandler( async (req: Request, res: Response, next: NextFunction): Promise<void> => 
{
    responseFunction( res, {
        message: `This is the home route! Service is running!`,
        statusCode: StatusCodes.OK,
        data: null
    })
} );