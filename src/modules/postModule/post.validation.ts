import * as z from "zod";
import { Visibility } from "./post.type";
import { likeType, ObjectId } from "../../utils/globalValidationSchema";

export const PostValidation = {
  createPost: z
    .object({
      content: z.string().optional(),
      allowComments: z.boolean().default(true),
      visibility: z
        .enum([...Object.values(Visibility)])
        .default(Visibility.PUBLIC),
      attachments: z.array(z.any()).optional(),
      tags: z.array(ObjectId).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        !data.content &&
        (!data.attachments || data.attachments.length === 0)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Content or attachments must be sent",
          path: ["attachments", "content"],
        });
      }
    })
    .strict(),
  like: z.object({
    idPost: ObjectId,
    likeType: likeType,
  }),
  update: z
    .object({
      postId: ObjectId,
      content: z.string().optional(),
      allowComments: z.boolean().default(true),
      visibility: z
        .enum([...Object.values(Visibility)])
        .default(Visibility.PUBLIC),
      attachments: z.array(z.any()).optional(),
      deleteAttachments: z.array(z.string()).optional(),
      tags: z.array(ObjectId).optional(),
    })
    .strict(),
};
