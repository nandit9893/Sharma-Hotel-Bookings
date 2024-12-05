import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public",
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueFilename = `${file.fieldname}_${timestamp}_${randomString}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const uploadHotel = multer({
  storage,
  limits: { files: 10 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  },
});

export default uploadHotel;
