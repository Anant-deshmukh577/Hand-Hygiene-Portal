import asyncHandler from './asyncHandler.js';
import fs from 'fs';
import path from 'path';

// Allowed image mime types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Middleware to validate avatar file upload
 */
export const validateAvatarUpload = asyncHandler(async (req, res, next) => {
  try {
    // Check if files exist and avatar is present
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const file = req.files.avatar;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
      });
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
      });
    }

    // Require either temp file or in-memory buffer (express-fileupload may use either)
    const hasTempFile = file.tempFilePath && fs.existsSync(file.tempFilePath);
    const hasBuffer = file.data && Buffer.isBuffer(file.data) && file.data.length > 0;
    
    if (!hasTempFile && !hasBuffer) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed. Please try again.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'File validation error',
      error: error.message,
    });
  }
});
