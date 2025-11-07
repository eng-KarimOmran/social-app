import { Response } from "express";

interface ISendResponse {
  res: Response;
  status?: number;
  message?: string;
  data?: {};
}

const sendResponse = ({
  res,
  status = 200,
  message = "done",
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
