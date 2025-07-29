import slugify from "slugify";

export const generateSlug = ( email: string, role: string ) =>
{
    const slugInput = `${ email }-${ role }`;

    return slugify( slugInput, { lower: true, strict: false } );
};