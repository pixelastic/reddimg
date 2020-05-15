const helper = require('../lib/main.js');
(async function() {
  const subredditName = 'DnDIY';
  await helper.updateSubredditData(subredditName);
})();

