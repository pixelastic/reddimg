const defaultConfig = require('norska/lib/tailwind.config.js');
const _ = require('golgoth/lib/lodash');
const customConfig = {
  variants: {
    overflow: ['responsive', 'hover'],
    whitespace: ['responsive', 'hover'],
  },
};
module.exports = _.merge(defaultConfig, customConfig);
