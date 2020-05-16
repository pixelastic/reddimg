const cloudinary = require('norska/frontend/cloudinary');
cloudinary.init({
  bucketName: 'pixelastic-reddimg',
});
const lazyloadAttributes = require('norska/frontend/lazyload/attributes');

module.exports = {
  picture(item) {
    const options = { width: 600 };
    return lazyloadAttributes(item.picture, options);
  },
};
