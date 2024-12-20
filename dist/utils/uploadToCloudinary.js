"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../cloudinary/cloudinary"));
const uploadFileToCloudinary = (fileBuffer, folder, type, format) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                resource_type: type, // Automatically detect file type
                folder: folder,
                public_id: `${folder}_${Date.now()}`,
                format: format,
            }, (error, result) => {
                if (error)
                    reject(error);
                else if (result)
                    resolve(result);
                else
                    reject(new Error("Upload failed with undefined result"));
            });
            stream.end(fileBuffer);
        });
        return result;
    }
    catch (error) {
        throw new Error("Failed to upload file to Cloudinary");
    }
});
exports.uploadFileToCloudinary = uploadFileToCloudinary;
