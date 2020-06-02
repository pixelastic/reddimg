const lazyload = require('norska/frontend/lazyload');
const algolia = require('norska/frontend/algolia');
const {
  configure,
  hits,
  pagination,
  refinementList,
  sortBy,
  searchBox,
} = require('norska/frontend/algolia/widgets');
const credentials = window.ALGOLIA_CONFIG;
const transforms = require('./_scripts/transforms.js');

const widgets = [
  /**
   * Main configuration
   **/
  {
    type: configure,
    options: {
      hitsPerPage: 42,
    },
  },
  /**
   * Searchbar
   **/
  {
    type: searchBox,
    options: {
      container: '#searchbox',
      placeholder: 'Search in titles',
      autofocus: true,
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
    },
  },
  /**
   * Hits
   **/
  {
    type: hits,
    options: {
      container: '#hits',
      templates: {
        item: document.getElementById('hitTemplate').value,
        empty: document.getElementById('emptyTemplate').value,
      },
    },
  },
  {
    type: pagination,
    options: {
      container: '#pagination',
    },
  },
  /**
   * Filtering
   **/
  {
    type: refinementList,
    options: {
      container: '#filterBucket',
      attribute: 'bucket',
      sortBy: ['name:asc'],
    },
  },
  /**
   * Sorting
   **/
  {
    type: sortBy,
    options: {
      container: '#sortBy',
      items: [
        { label: 'by date', value: credentials.indexName },
        {
          label: 'by popularity',
          value: `${credentials.indexName}_popularity`,
        },
      ],
    },
  },
];

algolia
  .init(credentials)
  .setWidgets(widgets)
  .setTransforms(transforms)
  // .onDisplay(hit => {
  //   console.info(hit.picture);
  // })
  .start();

lazyload.init();
