import { Request, Response } from 'express';
export interface CustomError extends Error {
    statusCode?: number;
    status?: string;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
//# sourceMappingURL=errorHandler.d.ts.map