/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from "../utils/controller.util";

export const globalNotFoundResponse = asyncHandler( async ( req: Response, res: Request, next: NextFunction ) =>
{
    responseFunction( res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: "Route not found!",
        data: null
    } );
} );