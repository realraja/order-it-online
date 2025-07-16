const cloudinary = require('cloudinary').v2;


const folderName = process.env.DB_NAME || "Order-App"; // Set your folder name here

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadResponse = async (files) => {
  try {
    if (!Array.isArray(files)) {
      throw new Error("Expected an array of files.");
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file, {
        folder: folderName,
        resource_type: "auto", // Support any file type
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Return array of uploaded file URLs or full metadata
    return uploadResults.map(result => result.secure_url);

  } catch (error) {
    console.log('Upload error:', error);
    throw new Error("File upload failed. " + error.message);
  }
};








