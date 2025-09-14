import { Response } from "express";

interface ISendResponse {
  res: Response;
  status: number;
  message: string;
  data?: {};
}

const sendResponse = ({
  res,
  status,
  message,
  data = {},
}: ISendResponse): Response => {
  return res.status(status).json({
    success: true,
    status,
    message,
    ...data,
  });
};

export default sendResponse;
