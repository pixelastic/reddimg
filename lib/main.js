const he = require('he');
const _ = require('golgoth/lib/lodash');
const readJsonUrl = require('firost/lib/readJsonUrl');
const readJson = require('firost/lib/readJson');
const exists = require('firost/lib/exists');
const writeJson = require('firost/lib/writeJson');
const path = require('path');
const glob = require('firost/lib/glob');

module.exports = {
  /**
   * Update the local .json file with new records
   * @param {string} subredditName Name of the subreddit
   **/
  async updateSubredditData(subredditName) {
    const remoteRecords = await this.getRemoteRecords(subredditName);
    const localData = await this.getLocalData(subredditName);
    const newData = this.mergeData(localData, remoteRecords);
    const dataPath = this.getDataPath(subredditName);
    await writeJson(newData, dataPath);
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
    const previewUrl = this.getPreviewFromPost(rawPost, 600);

    const id = _.get(rawPost, 'data.name');

    return {
      title,
      id,
      url,
      date,
      score,
      picture,
      previewUrl,
    };
  },
  /**
   * Returns a picture url from a given post
   *
   * @param {object} rawPost Raw reddit post
   * @returns {string} Url of picture
   */
  getPictureFromPost(rawPost) {
    const firstImg = _.get(rawPost, 'data.preview.images[0]', false);
    if (!firstImg) {
      return false;
    }
    return _.chain(firstImg).get('source.url').replace(/&amp;/g, '&').value();
  },
  /**
   * Returns a preview url from a given post
   * @param {object} rawPost Raw reddit post
   * @param {number} minWidth Minimum width
   * @returns {string} Url of the preview, or the source if no preview found
   **/
  getPreviewFromPost(rawPost, minWidth) {
    const firstImg = _.get(rawPost, 'data.preview.images[0]', false);
    if (!firstImg) {
      return false;
    }

    return _.chain(firstImg)
      .get('resolutions', [])
      .sortBy('width')
      .find((resolution) => {
        return resolution.width >= minWidth;
      })
      .get('url')
      .replace(/&amp;/g, '&')
      .value();
  },
  /**
   * Returns path to the .json file in _data holding the records
   * @param {string} subredditName Name of the subreddit
   * @returns {string} Path to the .json file
   **/
  getDataPath(subredditName) {
    return path.resolve(`./records/${subredditName}.json`);
  },
  /**
   * Returns the content of the src/_data/*.json file
   * @param {string} subredditName Name of the subreddit
   * @returns {object} Config object
   **/
  async getLocalData(subredditName) {
    const dataPath = this.getDataPath(subredditName);
    if (!(await exists(dataPath))) {
      return {};
    }
    return await readJson(dataPath);
  },
  /**
   * Merge existing local data with new remote records
   * Add news records, update existing ones
   * @param {object} localData Current local data config
   * @param {Array} remoteRecords List of remote records
   * @returns {object} Merged data
   **/
  mergeData(localData = [], remoteRecords) {
    const localRecords = _.get(localData, 'records', []);
    const keyedLocalRecords = _.keyBy(localRecords, 'id');
    const keyedRemoteRecords = _.keyBy(remoteRecords, 'id');
    const newRecords = _.chain(keyedLocalRecords)
      .merge(keyedRemoteRecords)
      .sortBy(['date'])
      .reverse()
      .value();
    return {
      ...localData,
      records: newRecords,
    };
  },
  /**
   * Returns the list of subreddit configured
   * @returns {Array} List of subreddits
   **/
  async getLocalSubreddits() {
    const dataFiles = await glob('./records/*.json');
    return _.chain(dataFiles)
      .map((filename) => {
        return path.basename(filename, '.json');
      })
      .sort()
      .value();
  },
};
