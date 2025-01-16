import cloudinary from "../config/cloudinary.js";


export const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'user_profiles',
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        // Pipe the fileBuffer to the Cloudinary stream
        stream.end(fileBuffer);
    });
};