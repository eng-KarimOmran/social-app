import { customAlphabet } from "nanoid";

export const createCode = (): string => {
  const nanoid = customAlphabet("0123456789", 6);
  const code = nanoid();
  return code;
};
