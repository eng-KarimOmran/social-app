export interface ICustomError extends Error {
  statusCode: number;
}

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, options?: ErrorOptions) {
    super(message, options);
    this.statusCode = statusCode;
  }
}