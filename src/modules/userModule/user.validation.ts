import * as z from "zod";
import { uploadFile } from "../../utils/globalValidationSchema";

export const profileImage = uploadFile.image;
