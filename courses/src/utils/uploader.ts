import multer from "multer";
import path from "path";
import fs from "fs";

function coverUploader(isCover: Boolean = false) {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      const slug = req.body.title?.trim().replace(/[\s_\.]/g, "-");
      if (
        !fs.existsSync(
          path.join(
            __dirname,
            "..",
            "..",
            "public",
            "courses",
            req.body.title?.trim().replace(/[\s_\.]/g, "-")
          )
        )
      ) {
        fs.mkdirSync(
          path.join(__dirname, "..", "..", "public", "courses", slug)
        );
      }
      callback(
        null,
        path.join(__dirname, "..", "..", "public", "courses", slug)
      );
    },
    filename: function (req, file, callback) {
      console.log("object");

      const name = `${Date.now()}-${Math.floor(
        Math.random() * 10e9
      )}${path.extname(file.originalname)}`;

      if (!file.originalname.includes(".png")) {
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
