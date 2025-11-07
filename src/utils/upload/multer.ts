import multer from "multer";
import fs from "fs";
import path from "path";
import { IRequest } from "../../middlewares/auth.middleware";

export const TypesFile = {
  image: ["image/jpeg", "image/png", "image/jpg"],
};

export const upload = () => {
  const baseUploadPath = path.join(__dirname, "../../../uploadMedia");
  console.log(__dirname)
  const storage = multer.diskStorage({
    destination: function (req: IRequest, file, cb) {
      const userFolder = `${baseUploadPath}/${req.user?._id}`;
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
      cb(null, userFolder);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  return multer({
    storage,
  });
};
