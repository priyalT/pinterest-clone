import { cloudinary } from "../config/cloudinary.js";

export const uploadToCloudinary = async (multerImage: Express.Multer.File) => {
       try {
        const base64 = multerImage.buffer.toString("base64");
        const dataUri = `data:${multerImage.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "pins",
        })
        return {
            imageUrl: result.secure_url,
            publicId: result.public_id,
        };

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

export const deleteFromCloudinary = async (public_id: string
) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new Error("Failed to delete image from Cloudinary.")
    }
};


