type ErrorType = {
  message: string;
  statusCode: number;
};

interface Errors {
  serverError: ErrorType;
  invalidToken: ErrorType;
  userNotFound: ErrorType;
  userAlreadyExists: ErrorType;
  emailAlreadyConfirmed: ErrorType;
  codeNotRequested: ErrorType;
  invalidCode: ErrorType;
  expiredCode: ErrorType;
  invalidPassword: ErrorType;
  invalidTokenType: ErrorType;
  tokenExpired: ErrorType;
  invalidBearerKey: ErrorType;
  codeAlreadySent: ErrorType;
  invalidFileType: ErrorType;
  uploadFailed: ErrorType;
  failedGetFile: ErrorType;
}

export const errors: Errors = {
  serverError: {
    message: "Internal server error.",
    statusCode: 500,
  },
  invalidToken: {
    message: "Invalid token.",
    statusCode: 400,
  },
  userNotFound: {
    message: "User not found.",
    statusCode: 404,
  },
  userAlreadyExists: {
    message: "The user already exists.",
    statusCode: 400,
  },
  emailAlreadyConfirmed: {
    message: "Email already confirmed.",
    statusCode: 400,
  },
  codeNotRequested: {
    message: "The code must be requested before confirmation.",
    statusCode: 404,
  },
  invalidCode: {
    message: "The code is invalid.",
    statusCode: 400,
  },
  expiredCode: {
    message: "This code has expired. Request a new code.",
    statusCode: 400,
  },
  invalidPassword: {
    message: "Invalid password.",
    statusCode: 400,
  },
  invalidTokenType: {
    message: "Invalid token type.",
    statusCode: 500,
  },
  tokenExpired: {
    message: "Token has expired.",
    statusCode: 401,
  },
  invalidBearerKey: {
    message: "Bearer key is incorrect.",
    statusCode: 409,
  },
  codeAlreadySent: {
    message: "The code has been sent. Please try again later.",
    statusCode: 400,
  },
  invalidFileType: {
    message: "Invalid file type.",
    statusCode: 409,
  },
  uploadFailed: {
    message: "File upload failed",
    statusCode: 400,
  },
  failedGetFile: {
    message: "Failed to get to file",
    statusCode: 400,
  },
};
