import expres, { Request, Response, NextFunction } from "express";

interface theAsyncMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const catchAsync = (fn: theAsyncMiddleware) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
