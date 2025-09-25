"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
const findUser = async (req, res, next) => {
    const invalidToken = new InvalidTokenRepo();
    const { authorization } = req.headers;
    const BEARER_KEY = process.env.BEARER_KEY;
    if (!authorization?.startsWith(BEARER_KEY)) {
        throw new CustomError("Bearer Key is incorrect", 409);
    }
    const token = authorization.split(" ")[1];
    const payload = verifyToken(type, token);
    const jtiInvalid = await invalidToken.findOne({
        filter: {
            jti: payload.jti,
        },
    });
    if (jtiInvalid) {
        throw new CustomError("Invalid token", 400);
    }
    req.payload = payload;
    return next();
};
exports.findUser = findUser;
