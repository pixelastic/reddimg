module.exports = async function () {
  const defaultValues = {
    defaultDescription: 'Auto-updating gallery of pictures from subreddits',
    defaultTitle: 'Reddimg',
    defaultUrl: 'https://reddimg.pixelastic.com',
    defaultAuthor: 'Tim Carry',
    defaultTwitter: 'pixelastic',
  };

  const algolia = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME,
  };

  return {
    ...defaultValues,
    algolia,
  };
};
