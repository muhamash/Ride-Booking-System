import axios from "axios";
import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { envStrings } from "../../../config/env.config";
import { AppError } from "../../../config/errors/App.error";
import { asyncHandler, responseFunction } from "../../utils/controller.util";

export const searchLocation = asyncHandler( async ( req: Request, res: Response ) =>
{
    try
    {
        // console.log( req.userLocation, req.body )
        const userLocation = req.userLocation;
        const { query_text } = req.body;

        if ( !query_text )
        {
            throw new AppError( httpStatus.BAD_REQUEST, "Invalid Body" )
        }

        //  https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=72fb63788da1470ab0c871c6aaab970c

        // `https://maps-api.pathao.io/v1/location/autocomplete/${ userLocation.coordinates[ 1 ] }/${ userLocation.coordinates[ 0 ] }/${ query_text }`,

        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/search?text=${ query_text }&format=json&apiKey=${envStrings.GEOAPIFY_API_KEY}`,
            // {
            //     headers: {
            //         Authorization: envStrings.PATHAO_API_KEY,
            //     },
            // }
        );

        // console.log(response)
        const result = response.data;
        // console.log(result)

        responseFunction( res, {
            data: result.results,
            message: "search result",
            statusCode: httpStatus.OK
        } );

    } catch ( error: unknown )
    {
        if ( error instanceof Error )
        {
            console.error( "Location search error:", error.message );
        } else
        {
            console.error( "Location search error: Unknown error", error );
        }
        throw new AppError( httpStatus.BAD_REQUEST, "Location search error" )
    }
} );

const LOCATIONIQ_API_KEY = envStrings.LOCATIONIQ_API_KEY;
const LOCATIONIQ_BASE_URL = "https://us1.locationiq.com/v1";

export const getDirection = asyncHandler( async ( req: Request, res: Response ) =>
{
    try
    {
        const { profile, coordinates, alternatives, steps, overview } = req.body;

        if ( !profile || !coordinates )
        {
            throw new AppError( httpStatus.BAD_REQUEST, "Bad request body for direction" )
        }

       

        const url = `${ LOCATIONIQ_BASE_URL }/directions/${ profile }/${ coordinates }`;

        const response = await axios.get( url, {
            params: {
                key: LOCATIONIQ_API_KEY,
                alternatives: alternatives || false,
                steps: steps || false,
                overview: overview || "simplified",
            },
        } );

        console.log( response );

        responseFunction( res, {
            statusCode: httpStatus.OK,
            message: "Route retrieved successfully",
            data: response.data,
        } );

    } catch ( error: unknown )
    {

        if ( axios.isAxiosError( error ) )
        {
            console.error( "LocationIQ Directions Error:", error.response?.data || error.message );
        } else if ( error instanceof Error )
        {
            console.error( "LocationIQ Directions Error:", error.message );
        } else
        {
            console.error( "LocationIQ Directions Error: Unknown error", error );
        }

        throw new AppError( httpStatus.BAD_REQUEST, "Error on destination finding!!" )
    }
} );