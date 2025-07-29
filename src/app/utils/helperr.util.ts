import haversine from 'haversine-distance';
import slugify from "slugify";

export const generateSlug = ( email: string, role: string ) =>
{
    const slugInput = `${ email }-${ role }`;

    return slugify( slugInput, { lower: true, strict: false } );
};

export const estimateFare = ( { startLat, startLng, endLat, endLng, durationInMin } ) =>
{
    const distance = haversine(
        { lat: startLat, lng: startLng },
        { lat: endLat, lng: endLng }
    ) / 1000; 

    const baseFare = 50;
    const perKm = 20;
    const perMin = 2;

    const totalFare = baseFare + distance * perKm + durationInMin * perMin;

    return {
        distance: Number( distance.toFixed( 2 ) ), 
        durationInMin,
        estimatedFare: Math.ceil( totalFare )
    };
};