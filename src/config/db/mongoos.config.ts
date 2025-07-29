import httpStatus from 'http-status-codes';
import mongoose from "mongoose";
import { envStrings } from '../env.config';
import { AppError } from '../errors/App.error';

export const dbConnect = async () : Promise<void> =>
{

    try {
        await mongoose.connect( envStrings.DB_URL );
        
        console.log( `MongoDB database is connected!! 🥭` )
    }
    catch ( error : unknown )
    {
        // console.log(error)
        throw new AppError( httpStatus.BAD_GATEWAY, error );
    }    
}