const helper = require('../lib/main.js');
const pMap = require('golgoth/lib/pMap');

(async function() {
  const subreddits = await helper.getLocalSubreddits();
  await pMap(subreddits, async subreddit => {
    await helper.updateSubredditData(subreddit);
  });
})();
