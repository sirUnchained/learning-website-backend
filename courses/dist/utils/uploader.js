"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function coverUploader(isCover = false) {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, callback) {
            var _a, _b;
            const slug = (_a = req.body.title) === null || _a === void 0 ? void 0 : _a.trim().replace(/[\s_\.]/g, "-");
            if (!fs_1.default.existsSync(path_1.default.join(__dirname, "..", "..", "public", "courses", (_b = req.body.title) === null || _b === void 0 ? void 0 : _b.trim().replace(/[\s_\.]/g, "-")))) {
                fs_1.default.mkdirSync(path_1.default.join(__dirname, "..", "..", "public", "courses", slug));
            }
            callback(null, path_1.default.join(__dirname, "..", "..", "public", "courses", slug));
        },
        filename: function (req, file, callback) {
            const name = `${Date.now()}-${Math.floor(Math.random() * 10e9)}${path_1.default.extname(file.originalname)}`;
            if (!file.originalname.includes(".png")) {
                callback(new Error("cover type must be png."), "cover type must be png.");
            }
            callback(null, name);
        },
    });
    return (0, multer_1.default)({
        storage: storage,
        limits: { fileSize: 3 * 1024 * 1024 },
    });
}
exports.default = coverUploader;
