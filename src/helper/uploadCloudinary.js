const ClientError = require("../exceptions/ClientError");

const cloudinary = require("cloudinary").v2;

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload handler
const cloudUploadHandler = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    console.log(result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.log(error);
    throw new ClientError(error);
  }
};
const cloudDeleteHandler = async (url) => {
  try {
    const result = await cloudinary.uploader.destroy(url);
    console.log(result);
    return result;
  } catch (error) {
    throw new ClientError(error);
  }
};

module.exports = { cloudUploadHandler, cloudDeleteHandler };
