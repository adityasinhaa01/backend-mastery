const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
  try{
    const result = await cloudinary.uploader.upload(filePath);

    return {
      url : result.secure_url,
      publicId : result.public_id
    }
    
  } catch(err){
    console.error("Error occured while uploading to cloudinary: ", err);
    throw new Error('File upload error')
  }
}

module.exports = uploadToCloudinary;