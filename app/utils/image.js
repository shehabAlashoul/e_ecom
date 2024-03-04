import {v2 as cloudinary} from 'cloudinary';

export const uploadImage =async (path) => {
    const {public_id:imageName,secure_url:imagePath} = await cloudinary.uploader.upload(path);
    return {imageName,imagePath}
}
export const deleteImage =async (imageName) => {
     await cloudinary.uploader.destroy(imageName);
}