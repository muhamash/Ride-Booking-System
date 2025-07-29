import { NextFunction, Request, Response } from "express";
import { AsyncHandlerType } from "./types.util";

export const asyncHandler = ( fn: AsyncHandlerType ) => ( req: Request, res: Response, next: NextFunction ): Promise<void> =>
{
    Promise.resolve( fn( req, res, next ) ).catch( ( error: unknown ) =>
    {
        console.log( error );

        next(error)
    });
};

export const responseFunction = <T> ( res: Response, data?: TResponse<T> ) =>
{
    // console.log(data)
    res.status( data.statusCode ).json( {
        message: data.message,
        statusCode: data.statusCode,
        meta: data.meta,
        data: data.data
    } );
}

export const setCookie = async (res: Response, cookieName: string, cookieData, maxAge: number): Promise<void> =>
{
    res.cookie( cookieName, cookieData, {
        httpOnly: true,
        secure: false,
        maxAge
    } );
}