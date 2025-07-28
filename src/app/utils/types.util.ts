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

export type ParsedZodIssue = Record<string, string>;
export type ErrorResponsePayload = Record<string, unknown>;