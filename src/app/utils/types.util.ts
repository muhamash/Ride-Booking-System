export type AsyncHandlerType = ( req: Request, res: Response, next: NextFunction ) => Promise<void>;

export interface TMeta
{
    total: number;
}

export interface TResponse<T>
{
    statusCode: number;
    data: T;
    message: string;
    success?: boolean;
    meta?: TMeta
}

export interface ActiveDriver {
  driverId: string;
  userId: string;
  name: string;
  email: string;
  username: string;
  location: ILocation;
  isApproved: boolean;
  avgRating: number;
  vehicleInfo?: object;
}

export type ParsedZodIssue = Record<string, string>;
export type ErrorResponsePayload = Record<string, unknown>;