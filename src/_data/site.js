const helper = require('../../lib/main.js');

module.exports = async function() {
  const defaultValues = {
    defaultDescription: 'Auto-updating gallery of pictures from subreddits',
    defaultTitle: 'Reddimg',
    defaultUrl: 'https://reddimg.pixelastic.com',
    defaultImage: 'opengraph.png',
    defaultAuthor: 'Tim Carry',
    defaultTwitter: 'pixelastic',
  };

  const subreddits = await helper.getLocalSubreddits();

  return {
    ...defaultValues,
    subreddits,
  };
};
