/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";

export class QueryBuilder<T>
{
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;
    
    constructor ( modelQuery: Query<T[], T>, query: Record<string, string> )
    {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter (excludeField: string[]): this
    {
        const filter = { ...this.query }
        
        if ( filter )
        {
            for ( const field of  excludeField)
            {
            // console.log( query, field, query[ field ] );
                delete filter[ field ];
            };
        };

        this.modelQuery = this.modelQuery.find( filter );

        return this;
    };

    searchableField (searchableField: string[]): this
    {
        const searchTerm = this.query?.search || "";

        const searchQuery = {
            $or: searchableField.map( field => (
                {
                    [ field ]: { $regex: searchTerm, $options: "i" }
                }
            ) )
        };

        this.modelQuery?.find( searchQuery );

        return this;
    };

    sort (): this
    {
        const sort = this.query.sort || "-createdAt";

        this.modelQuery = this.modelQuery.sort( sort );

        return this
    };

    fields (): this
    {
        const fields = this.query.fields?.split( "," ).join( " " ) || "";

        this.modelQuery = this.modelQuery.select( fields );

        return this
    };

    pagination (): this
    {
        const limit = Number(this.query.limit) || 5;
        const page = Number( this.query.page ) || 1;
        const skip = Number( ( page - 1 ) * limit );

        this.modelQuery = this.modelQuery.skip( skip ).limit(limit);

        return this
    };

    build (): this
    {
        return this.modelQuery
    };

    async getMeta (): Record<string, unknown>
    {
        const totalDocuments = await this.modelQuery.model.countDocuments();

        const limit = Number(this.query.limit) || 5;
        const page = Number( this.query.page ) || 1;
        const totalPage = Math.ceil( totalDocuments / limit ),

        return {
            page,
            totalPage,
            limit,
            totalDocuments
        }
    };
};