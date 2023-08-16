import express from 'express';

// This wrapper must exist in its own file to avoid circulr imports between Route files and Index file
export function asyncWrapper(fn: Function) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
