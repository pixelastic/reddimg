const he = require('he');
const _ = require('golgoth/lib/lodash');
const readJsonUrl = require('firost/lib/readJsonUrl');
const readJson = require('firost/lib/readJson');
const exists = require('firost/lib/exists');
const writeJson = require('firost/lib/writeJson');
const path = require('path');

module.exports = {
  /**
   * Update the local .json file with new records
   * @param {string} subredditName Name of the subreddit
   **/
  async updateSubredditData(subredditName) {
    const remote = await this.getRemoteRecords(subredditName);
    const local = await this.getLocalRecords(subredditName);
    const records = this.mergeRecords(local, remote);
    const dataPath = this.getDataPath(subredditName);
    await writeJson(records, dataPath);
  },
  /**
   * Returns a list of records extracted from the latest posts of a given
   * subreddit
   * @param {string} subredditName Name of the subreddit
   * @returns {Array} List of records
   **/
  async getRemoteRecords(subredditName) {
    const posts = await this.getSubredditPosts(subredditName);
    return _.chain(posts)
      .map(this.getRecordFromPost.bind(this))
      .compact()
      .value();
  },
  /**
   * Get the list of latest posts from a subreddit
   * @param {string} subredditName Name of the subreddit
   * @returns {Array} List of posts
   **/
  async getSubredditPosts(subredditName) {
    const jsonUrl = `https://www.reddit.com/r/${subredditName}.json`;
    const cachePath = path.resolve(`tmp/cache/${subredditName}.json`);
    const rawData = await readJsonUrl(jsonUrl, { cachePath });
    return _.get(rawData, 'data.children', []);
  },
  /**
   * Converts a given post into a record
   * @param {object} rawPost Raw reddit post
   * @returns {*} A record object, or false if not suitable
   **/
  getRecordFromPost(rawPost) {
    const picture = this.getPictureFromPost(rawPost);
    if (!picture) {
      return false;
    }

    const title = he.decode(_.get(rawPost, 'data.title'));

    const permalink = _.get(rawPost, 'data.permalink');
    const score = _.get(rawPost, 'data.score', 0);
    const date = _.get(rawPost, 'data.created');
    const url = `https://reddit.com${permalink}`;

    const id = _.get(rawPost, 'data.name');

    return {
      title,
      id,
      url,
      date,
      score,
      picture,
    };
  },
  /**
   * Returns a picture url from a given post
   * @param {object} rawPost Raw reddit post
   * @returns {*} A media object, or false if not suitable
   **/
  getPictureFromPost(rawPost) {
    const firstImg = _.get(rawPost, 'data.preview.images[0]', false);
    if (!firstImg) {
      return false;
    }
    return _.chain(firstImg)
      .get('source.url')
      .replace(/&amp;/g, '&')
      .value();
  },
  /**
   * Returns path to the .json file in _data holding the records
   * @param {string} subredditName Name of the subreddit
   * @returns {string} Path to the .json file
   **/
  getDataPath(subredditName) {
    return path.resolve(`src/_data/${subredditName}.json`);
  },
  /**
   * Returns the list of existing records for a given subreddit
   * @param {string} subredditName Name of the subreddit
   * @returns {Array} List of records
   **/
  async getLocalRecords(subredditName) {
    const dataPath = this.getDataPath(subredditName);
    if (!(await exists(dataPath))) {
      return [];
    }
    return await readJson(dataPath);
  },
  /**
   * Merge existing local records with new remote ones
   * Add news records, update existing ones
   * @param {Array} local List of local records
   * @param {Array} remote List of remote records
   * @returns {Array} Merged list
   **/
  mergeRecords(local = [], remote) {
    const keyedLocal = _.keyBy(local, 'id');
    const keyedRemote = _.keyBy(remote, 'id');
    return _.chain(keyedLocal)
      .merge(keyedRemote)
      .sortBy(['date'])
      .reverse()
      .value();
  },
};
