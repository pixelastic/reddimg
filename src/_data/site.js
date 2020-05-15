const helper = require('../../lib/main.js');

module.exports = async function() {
  const defaultValues = {
    defaultDescription:
      'Your website description. You can overwrite it in any pug file',
    defaultTitle: 'Default page title. You can overwrite it in any pug file',
    defaultUrl: 'http://www.your-production-url.com/',
    defaultImage: 'opengraph.png',
    defaultAuthor: 'Your Name',
    defaultTwitter: 'yourusername',
  };

  const subreddits = await helper.getLocalSubreddits();

  return {
    ...defaultValues,
    subreddits,
  };
};
