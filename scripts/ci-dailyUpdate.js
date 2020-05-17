// const firost = require('firost');
const run = require('firost/lib/run');
const consoleSuccess = require('firost/lib/consoleSuccess');
const consoleInfo = require('firost/lib/consoleInfo');
const _ = require('golgoth/lib/lodash');
const dayjs = require('golgoth/lib/dayjs');
const { Octokit } = require('@octokit/rest');

const dailyUpdate = {
  githubUser: 'pixelastic',
  githubRepo: 'reddimg',
  octokit: new Octokit({ auth: process.env.GITHUB_TOKEN }),

  /**
   * Update local _data files with latest records
   **/
  async updateData() {
    await run('yarn run data:update');
  },

  /**
   * Check if files were changed since last commit
   * @returns {boolean} true if files were changed
   **/
  async hasChanges() {
    const gitDiff = await run('git diff --name-only', { stdout: false });
    const changedFiles = gitDiff.stdout.split('\n');
    const dataFiles = _.find(changedFiles, changedFile => {
      return _.startsWith(changedFile, 'src/_data/');
    });
    return dataFiles.length > 0;
  },

  /**
   * Commit changes to the repo and push them
   **/
  async commitAndPushChanges() {
    // Commit changes
    const currentDate = dayjs().format('YYYY-MM-DD');
    await run('git add ./src/_data/*.json');
    await run(
      `git commit --message chore(update):\\ Daily\\ update\\ (${currentDate})" --message "[skip ci]`
    );

    // Push changes
    await run('git push --set-upstream origin master');
  },

  /**
   * Index data to Algolia
   **/
  async indexToAlgolia() {
    await run('yarn run data:index');
  },

  async createIssue(err) {
    const errorDetails = err.stdout;
    await this.octokit.issues.create({
      owner: this.githubUser,
      repo: this.githubRepo,
      title: 'Daily update failing',
      body: [
        'The Daily update has failed with the following error:',
        '```',
        errorDetails,
        '```',
        `More details on ${process.env.CIRCLE_BUILD_URL}`,
      ].join('\n'),
    });
  },

  success() {
    process.exit(0);
  },
  failure() {
    process.exit(1);
  },

  async run() {
    try {
      await this.updateData();

      if (!(await this.hasChanges())) {
        consoleInfo('No new data fetched since last run, stopping now');
        return this.success();
      }

      await this.commitAndPushChanges();
      await this.indexToAlgolia();
      consoleSuccess(
        'New data pushed to the repository and indexed in Algolia'
      );
    } catch (err) {
      await this.createIssue(err);
      return this.failure();
    }
  },
};

(async function() {
  await dailyUpdate.run();
})();
