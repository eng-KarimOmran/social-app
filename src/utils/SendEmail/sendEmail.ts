import generateEmailTemplate from "./generateEmailTemplate";
import { transporter } from "./nodemailer";

export const sendEmail = async ({
  to,
  subject,
  text,
  name,
}: {
  to: string;
  subject: string;
  text: string;
  name: string;
}) => {
  const info = await transporter.sendMail({
    from: '"Social App" <pckareem2004@gmail.com>',
    to,
    subject,
    text,
    html: generateEmailTemplate({ username: name, subject, otp: text }),
  });
};
