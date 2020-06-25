const indexing = require('algolia-indexing');
const firost = require('firost');
const pMap = require('golgoth/lib/pMap');
const dayjs = require('golgoth/lib/dayjs');
const _ = require('golgoth/lib/lodash');
const path = require('path');

(async function () {
  const credentials = {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: process.env.ALGOLIA_INDEX_NAME,
  };
  const settings = {
    searchableAttributes: ['title'],
    attributesForFaceting: ['bucket', 'subreddit', 'dateAsDay'],
    customRanking: ['desc(dateAsDay)', 'desc(score)'],
    replicas: {
      popularity: {
        customRanking: ['desc(score)', 'desc(dateAsDay)'],
      },
    },
  };

  indexing.verbose();
  indexing.config({
    batchMaxSize: 100,
  });

  const files = await firost.glob('./src/_data/*.json');
  const subreddits = await pMap(files, async (filepath) => {
    const dataFile = await firost.readJson(filepath);
    const records = dataFile.records;
    const bucket = dataFile.bucket;
    const subreddit = path.basename(filepath, '.json');
    return _.map(records, (record) => {
      // Clamp the date at the start of the day
      const dateAsDay = dayjs
        .unix(record.date)
        .hour(0)
        .minute(0)
        .second(0)
        .unix();

      return {
        ...record,
        bucket,
        subreddit,
        dateAsDay,
      };
    });
  });
  const records = _.flatten(subreddits);
  await indexing.fullAtomic(credentials, records, settings);
})();
