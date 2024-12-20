import { Response } from "express";

export const AppResponse = (
  res: Response,
  statusCode: number,
  status: string,
  message: string,
  data: unknown[] | string | unknown
) => {
  res.status(statusCode).json({
    status: status,
    message: message,
    data: {
      data,
    },
  });
};
