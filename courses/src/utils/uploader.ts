import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const supported = [".png", ".jpg", ".jpeg"];

function coverUploader(isCover: Boolean = false) {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      // const slug = req.body.title?.trim().replace(/[\s_\.]/g, "-");
      // if (
      //   !fs.existsSync(
      //     path.join(
      //       __dirname,
      //       "..",
      //       "..",
      //       "public",
      //       "courses",
      //       req.body.title?.trim().replace(/[\s_\.]/g, "-")
      //     )
      //   )
      // ) {
      //   fs.mkdirSync(
      //     path.join(__dirname, "..", "..", "public", "courses", slug)
      //   );
      // }
      callback(null, path.join(__dirname, "..", "..", "public", "courses"));
    },
    filename: function (req, file, callback) {
      const name = `${Date.now()}-${Math.floor(
        Math.random() * 10e9
      )}${path.extname(file.originalname)}`;

      const result = supported.some((format) =>
        file.originalname.includes(format)
      );
      if (!result) {
        callback(
          new Error("cover type must be png."),
          "cover type must be png."
        );
      }

      callback(null, name);
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 },
  });
}

export default coverUploader;
