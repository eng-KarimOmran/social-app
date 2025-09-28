"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileMiddleware = void 0;
const s3_Service_1 = require("../utils/upload/s3.Service");
const Error_1 = require("../utils/Error");
const globalErrors_1 = require("../utils/globalErrors");
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const getFileMiddleware = async (req, res, next) => {
    const { action } = req.query;
    const pipelinePromise = (0, node_util_1.promisify)(node_stream_1.pipeline);
    const { path } = req.params;
    const Key = path.join("/");
    const s3Res = await (0, s3_Service_1.getFile)({ Key });
    if (!s3Res.Body) {
        throw new Error_1.CustomError(globalErrors_1.errors.failedGetFile.message, globalErrors_1.errors.failedGetFile.statusCode);
    }
    if (action === "download") {
        const name = path.at(-1)?.slice(15);
        res.header("Content-Disposition", `attachment; filename="${name}"`);
    }
    res.setHeader("Content-Type", `${s3Res.ContentType || "application/octet-stream"}`);
    return await pipelinePromise(s3Res.Body, res);
};
exports.getFileMiddleware = getFileMiddleware;
