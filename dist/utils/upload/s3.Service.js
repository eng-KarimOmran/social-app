"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getFile = exports.ceratePreSignedUrl = exports.uploadMultiFile = exports.uploadSingleLargeFileS3 = exports.uploadSingleFileS3 = void 0;
const fs_1 = require("fs");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Config_1 = require("./s3Config");
const Error_1 = require("../Error");
const globalErrors_1 = require("../globalErrors");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const nanoid_1 = require("nanoid");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uploadSingleFileS3 = async ({ Bucket = process.env.S3_BUCKET, ACL = "private", path = "general", file, }) => {
    const Command = new client_s3_1.PutObjectCommand({
        Bucket,
        ACL,
        Key: `social-app/${path}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await (0, s3Config_1.s3Config)().send(Command);
    if (!Command.input.Key) {
        throw new Error_1.CustomError(globalErrors_1.errors.uploadFailed.message, globalErrors_1.errors.uploadFailed.statusCode);
    }
    return Command.input.Key;
};
exports.uploadSingleFileS3 = uploadSingleFileS3;
const uploadSingleLargeFileS3 = async ({ Bucket = process.env.S3_BUCKET, ACL = "private", path = "general", file, }) => {
    const upload = new lib_storage_1.Upload({
        client: (0, s3Config_1.s3Config)(),
        params: {
            Bucket,
            ACL,
            Key: `social-app/${path}/${(0, nanoid_1.nanoid)(15)}_${file.originalname}`,
            Body: (0, fs_1.createReadStream)(file.path),
            ContentType: file.mimetype,
        },
    });
    const { Key } = await upload.done();
    if (!Key) {
        throw new Error_1.CustomError(globalErrors_1.errors.uploadFailed.message, globalErrors_1.errors.uploadFailed.statusCode);
    }
    return Key;
};
exports.uploadSingleLargeFileS3 = uploadSingleLargeFileS3;
const uploadMultiFile = async ({ files, }) => {
    let keys = [];
    for (const file of files) {
        const key = await (0, exports.uploadSingleLargeFileS3)({ file });
        keys.push(key);
    }
    return keys;
};
exports.uploadMultiFile = uploadMultiFile;
const ceratePreSignedUrl = async ({ Bucket = process.env.S3_BUCKET, path = "general", expiresIn = 120, originalname, ContentType, }) => {
    const client = (0, s3Config_1.s3Config)();
    const command = new client_s3_1.PutObjectCommand({
        Bucket,
        Key: `social-app/${path}/${(0, nanoid_1.nanoid)(15)}${originalname}`,
        ContentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn });
    if (!command.input.Key || !url) {
        throw new Error_1.CustomError(globalErrors_1.errors.uploadFailed.message, globalErrors_1.errors.uploadFailed.statusCode);
    }
    return { url, Key: command.input.Key };
};
exports.ceratePreSignedUrl = ceratePreSignedUrl;
const getFile = async ({ Bucket = process.env.S3_BUCKET, Key, }) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket,
        Key,
    });
    return await (0, s3Config_1.s3Config)().send(command);
};
exports.getFile = getFile;
const deleteFile = async ({ Bucket = process.env.S3_BUCKET, Key, }) => {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket,
        Key,
    });
    return await (0, s3Config_1.s3Config)().send(command);
};
exports.deleteFile = deleteFile;
