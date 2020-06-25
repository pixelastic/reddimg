const helper = require('../../lib/main.js');

module.exports = async function () {
  const defaultValues = {
    defaultDescription: 'Auto-updating gallery of pictures from subreddits',
    defaultTitle: 'Reddimg',
    defaultUrl: 'https://reddimg.pixelastic.com',
    defaultImage: 'opengraph.png',
    defaultAuthor: 'Tim Carry',
    defaultTwitter: 'pixelastic',
  };

  const subreddits = await helper.getLocalSubreddits();

  const algolia = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME,
  };

  return {
    ...defaultValues,
    subreddits,
    algolia,
  };
};
