import { createReadStream } from "fs";
import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Config } from "./s3Config";
import { CustomError } from "../Error";
import { errors } from "../globalErrors";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadSingleFileS3 = async ({
  Bucket = process.env.S3_BUCKET as string,
  ACL = "private",
  path = "general",
  file,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
}): Promise<string> => {
  const Command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `social-app/${path}/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await s3Config().send(Command);
  if (!Command.input.Key) {
    throw new CustomError(
      errors.uploadFailed.message,
      errors.uploadFailed.statusCode
    );
  }
  return Command.input.Key;
};

export const uploadSingleLargeFileS3 = async ({
  Bucket = process.env.S3_BUCKET as string,
  ACL = "private",
  path = "general",
  file,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  file: Express.Multer.File;
}): Promise<string> => {
  const upload = new Upload({
    client: s3Config(),
    params: {
      Bucket,
      ACL,
      Key: `social-app/${path}/${nanoid(15)}_${file.originalname}`,
      Body: createReadStream(file.path),
      ContentType: file.mimetype,
    },
  });

  const { Key } = await upload.done();

  if (!Key) {
    throw new CustomError(
      errors.uploadFailed.message,
      errors.uploadFailed.statusCode
    );
  }

  return Key;
};

export const uploadMultiFile = async ({
  files,
}: {
  files: Express.Multer.File[];
}): Promise<string[]> => {
  let keys: string[] = [];
  for (const file of files) {
    const key = await uploadSingleLargeFileS3({ file });
    keys.push(key);
  }
  return keys;
};

export const ceratePreSignedUrl = async ({
  Bucket = process.env.S3_BUCKET as string,
  path = "general",
  expiresIn = 120,
  originalname,
  ContentType,
}: {
  Bucket?: string;
  ACL?: ObjectCannedACL;
  path?: string;
  expiresIn?: number;
  originalname: string;
  ContentType: string;
}): Promise<{ url: string; Key: string }> => {
  const client = s3Config();
  const command = new PutObjectCommand({
    Bucket,
    Key: `social-app/${path}/${nanoid(15)}${originalname}`,
    ContentType,
  });
  const url = await getSignedUrl(client, command, { expiresIn });
  if (!command.input.Key || !url) {
    throw new CustomError(
      errors.uploadFailed.message,
      errors.uploadFailed.statusCode
    );
  }
  return { url, Key: command.input.Key };
};

export const getFile = async ({
  Bucket = process.env.S3_BUCKET as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });
  return await s3Config().send(command);
};

export const deleteFile = async ({
  Bucket = process.env.S3_BUCKET as string,
  Key,
}: {
  Bucket?: string;
  Key: string;
}): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({
    Bucket,
    Key,
  });
  return await s3Config().send(command);
};
