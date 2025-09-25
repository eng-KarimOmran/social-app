"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
exports.errors = {
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
};
