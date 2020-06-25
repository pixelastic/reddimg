const current = require('../main');

describe('current', () => {
  describe('getPictureFromPost', () => {
    it('should return the source', async () => {
      const input = {
        data: {
          preview: {
            images: [
              {
                source: {
                  url: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
                },
              },
            ],
          },
        },
      };

      const actual = current.getPictureFromPost(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
  });
  describe('getPreviewFromPost', () => {
    it('should return the resolution width the width closest but above the upperBound', async () => {
      const minWidth = 600;
      const input = {
        data: {
          preview: {
            images: [
              {
                source: {
                  url: 'http://there.com/image.jpg?a=1&amp;b=2&amp;c=3',
                },
                resolutions: [
                  {
                    url: 'nope',
                    width: 215,
                  },
                  {
                    url: 'yep',
                    width: 640,
                  },
                  {
                    url: 'nope',
                    width: 960,
                  },
                ],
              },
            ],
          },
        },
      };

      const actual = current.getPreviewFromPost(input, minWidth);
      expect(actual).toEqual('yep');
    });
  });
  describe('mergeData', () => {
    it('should add records to empty data', async () => {
      const local = {};
      const remote = [{ title: 'new one', id: 'foo', date: 1234 }];
      const expected = { records: remote };
      const actual = current.mergeData(local, remote);
      expect(actual).toEqual(expected);
    });
    it('should add new records, by date', async () => {
      const local = { records: [{ title: 'old post', id: 'foo', date: 1234 }] };
      const remote = [{ title: 'new post', id: 'bar', date: 4567 }];
      const actual = current.mergeData(local, remote);
      expect(actual.records[0]).toHaveProperty('title', 'new post');
      expect(actual.records[1]).toHaveProperty('title', 'old post');
    });
    it('should update data of existing entries', async () => {
      const local = {
        records: [{ title: 'old title', id: 'foo', date: 1234 }],
      };
      const remote = [{ title: 'new title', id: 'foo', date: 1234 }];
      const actual = current.mergeData(local, remote);
      expect(actual.records).toHaveLength(1);
      expect(actual.records[0]).toHaveProperty('title', 'new title');
    });
  });
});
