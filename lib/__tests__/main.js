const module = require('../main');

describe('module', () => {
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

      const actual = module.getPictureFromPost(input);
      expect(actual).toEqual('http://there.com/image.jpg?a=1&b=2&c=3');
    });
  });
  describe('mergeRecords', () => {
    it('should add records to empty array', async () => {
      const local = [];
      const remote = [{ title: 'new one', id: 'foo', date: 1234 }];
      const actual = module.mergeRecords(local, remote);
      expect(actual).toEqual(remote);
    });
    it('should add new records, by date', async () => {
      const local = [{ title: 'old post', id: 'foo', date: 1234 }];
      const remote = [{ title: 'new post', id: 'bar', date: 4567 }];
      const actual = module.mergeRecords(local, remote);
      expect(actual[0]).toHaveProperty('title', 'new post');
      expect(actual[1]).toHaveProperty('title', 'old post');
    });
    it('should update data of existing entries', async () => {
      const local = [{ title: 'old title', id: 'foo', date: 1234 }];
      const remote = [{ title: 'new title', id: 'foo', date: 1234 }];
      const actual = module.mergeRecords(local, remote);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toHaveProperty('title', 'new title');
    });
  });
});
