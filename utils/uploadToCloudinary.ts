// // UTILS/CLOUDINARY.JS

// import cloudinary from '../cloudinary/cloudinary';

// interface CloudinaryUploadResult {
//     secure_url: string;
//     public_id: string;
// }

// // FUNCTION FOR UPLOADING AN IMAGE OR PDF TO CLOUDINARY
// const uploadFileToCloudinary = async (
//     fileBuffer: Buffer,
//     isPDF: boolean = false
// ): Promise<string> => {
//     try {
//         const resourceType = 'raw' // Use 'raw' for PDFs, 'image' for images
//         const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//                 { resource_type: resourceType },
//                 (error, result) => {
//                     if (error) reject(error);
//                     resolve(result as CloudinaryUploadResult);
//                 }
//             );
//             stream.end(fileBuffer);
//         });
//         return result.secure_url;
//     } catch (error) {
//         throw new Error('Failed to upload file to Cloudinary');
//     }
// };

// export { uploadFileToCloudinary };

import cloudinary from '../cloudinary/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const uploadFileToCloudinary = async (pdfBuffer: Buffer): Promise<UploadApiResponse> => {
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
            resource_type: 'auto', // Automatically detect file type
            folder: 'receipts',
            public_id: `receipt_${Date.now()}`,
            format: 'pdf' // Ensures the file is saved as a PDF
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('Upload failed with undefined result'));
        }
      );

      stream.end(pdfBuffer);
    });

    return result;
  } catch (error) {
    throw new Error('Failed to upload PDF to Cloudinary');
  }
};

