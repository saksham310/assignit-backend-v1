import cloudinary from "../config/cloudinary.js";

export const updateUser = async (req, res) => {
    try {
        if (req.file) {
            const fileBuffer = req.file.buffer;

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'user_profiles',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: 'Failed to update profile',
                            error: error.message,
                        });
                    }
                    res.status(200).json({
                        message: 'Profile updated successfully',
                        imageUrl: result.secure_url,
                    });
                }
            );
            // Pipe the fileBuffer to the Cloudinary stream
            stream.end(fileBuffer);
        }
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({
            message: 'Failed to update profile',
            error: error.message,
        });
    }
};
