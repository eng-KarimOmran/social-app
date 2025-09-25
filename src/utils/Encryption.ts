import bcrypt from "bcrypt";

export const hash = async (text: string): Promise<string> => {
  const saltRounds = process.env.SALT_ROUNDS as string;
  const hashText = await bcrypt.hash(text, Number(saltRounds));
  return hashText;
};

export const compare = async (
  text: string,
  textHash: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(text, textHash);
  return isMatch;
};