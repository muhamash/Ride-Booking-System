import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { QueryBuilder } from "../../utils/db/queybuilder.util";
import { User } from "../user/user.model";
import { excludeField, searchableFields } from "./admin.constrain";


export const getAllUsersService = async ( query?: Record<string, string> ) =>
{
    const modelQuery = new QueryBuilder( User.find().populate("driver").select("-password"), query );

    const users = modelQuery.searchableField( searchableFields ).filter( excludeField ).sort().fields().pagination();

    const [data, meta] = await Promise.all( [
        users.build(),
        modelQuery.getMeta()
    ] );

    return {
        data,
        meta,
    };
};

export const getUserByIdService = async ( userId: string ) =>
{
    console.log(userId);
    const user = await User.findById( userId ).populate("driver").select("-password");

    if ( !user )
    {
        throw new AppError(httpStatus.NOT_FOUND, "User not found" );
    }

    return user;
}