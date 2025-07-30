/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { AppError } from "../../config/errors/App.error";
import { isZodError, parseZodError } from "../utils/middleware.util";
import { ErrorResponsePayload } from "../utils/types.util";

export const globalErrorResponse = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) =>
{
    let statusCode = httpStatus.BAD_REQUEST;
    let message = "Something went wrong";
    let stack: string | undefined;

    // zod
    if ( isZodError( error ) )
    {
        const fieldIssues = parseZodError( error );
        const customIssues = JSON.parse( error.message ) || [];
        
        message = fieldIssues.length
            ? `Validation error on field ' ${customIssues[0]?.path ?? fieldIssues[ 0 ]?.field }': ${ fieldIssues[ 0 ]?.message }`
            : customIssues[0]?.message ?? "Validation error!";

        // console.log(customIssues[0]);
        return res.status( httpStatus.BAD_REQUEST ).json( {
            name: error.name || "ZodError",
            message,
            status: httpStatus.BAD_REQUEST,
            success: false,
            errors: customIssues ??  fieldIssues,
            ...( process.env.NODE_ENV === "development" && { stack: error.stack } ),
        } );
    }

    // cast
    if (
        error instanceof mongoose.Error.CastError
    )
    {
        message = `Invalid value for '${ error.path }': ${ error.value }`;
        statusCode = httpStatus.BAD_REQUEST;
    }
    // mongo validation
    else if ( error instanceof mongoose.Error.ValidationError )
    {
        const errors = Object.values( error.errors ).map( ( err ) => ( {
            field: ( err as unknown ).path,
            message: err.message,
        } ) );
        message = `Validation failed on ${ errors.length } field(s).`;
        return res.status( httpStatus.BAD_REQUEST ).json( {
            name: "MongooseValidationError",
            message,
            status: httpStatus.BAD_REQUEST,
            success: false,
            errors,
            ...( process.env.NODE_ENV === "development" && { stack: error.stack } ),
        } );
    }
    //duplicate
    else if (
        typeof error === "object" &&
        error !== null &&
        ( error as unknown ).code === 11000
    )
    {
        const dupFields = Object.keys( ( error as unknown ).keyValue || {} );
        message = `Already exists!! : ${ dupFields.join( ", " ) }`;
        statusCode = httpStatus.CONFLICT;
    }
    // custom
    else if ( error instanceof AppError )
    {
        statusCode = error.statusCode;
        message = error.message;
        stack = error.stack;
    }
    // general js
    else if ( error instanceof Error )
    {
        message = error.message;
        stack = error.stack;
        statusCode = ( error as unknown ).statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    }
    // fallback unknown error
    else
    {
        message = "An unexpected error occurred.";
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }

    console.log(error)
    // build response
    const responsePayload: ErrorResponsePayload = {
        name: ( error as unknown ).name || "Error",
        message,
        status: statusCode,
        success: false,
    };

    if ( process.env.NODE_ENV === "development" && stack )
    {
        responsePayload.stack = stack;
    }

    return res.status( statusCode ).json( responsePayload );
};