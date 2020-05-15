const readJson = require('firost/lib/readJson');
const pMap = require('golgoth/lib/pMap');
const helper = require('./lib/main.js');

module.exports = {
  cloudinary: {
    bucketName: 'pixelastic-reddimg',
  },
  hooks: {
    async afterHtml({ createPage }) {
      const template = '_includes/_templates/subreddit.pug';
      const subreddits = await helper.getLocalSubreddits();

      // Create a page for each
      await pMap(subreddits, async subreddit => {
        const dataPath = helper.getDataPath(subreddit);
        const records = await readJson(dataPath);
        const destination = `${subreddit}/index.html`;
        const pageData = {
          subreddit: {
            name: subreddit,
            records,
          },
        };
        await createPage(template, destination, pageData);
      });
    },
  },
};
