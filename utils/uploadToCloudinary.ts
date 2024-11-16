import cloudinary from "../cloudinary/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  type: string | any,
  format: string
): Promise<UploadApiResponse> => {
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: type, // Automatically detect file type
          folder: folder,
          public_id: `${folder}_${Date.now()}`,
          format: format, 
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed with undefined result"));
        }
      );

      stream.end(fileBuffer);
    });

    return result;
  } catch (error) {
    throw new Error("Failed to upload file to Cloudinary");
  }
};
