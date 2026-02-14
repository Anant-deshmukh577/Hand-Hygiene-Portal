import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const missing = [];
if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
if (!apiKey) missing.push('CLOUDINARY_API_KEY');
if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

const isConfigured = missing.length === 0;

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export const cloudinaryStatus = { isConfigured, missing };
export default cloudinary;
