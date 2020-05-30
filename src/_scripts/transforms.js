const cloudinary = require('norska/frontend/cloudinary');
cloudinary.init({
  bucketName: 'pixelastic-reddimg',
});
const lazyloadAttributes = require('norska/frontend/lazyload/attributes');

module.exports = {
  preview(item) {
    // Some old record don't have a previewUrl, only a picture
    const previewUrl = item.previewUrl || item.picture;
    const options = { width: 600, placeholder: { width: 200 } };
    return lazyloadAttributes(previewUrl, options);
  },
};
