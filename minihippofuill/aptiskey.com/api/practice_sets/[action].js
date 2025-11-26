import createSet from '../../server/api/practice_sets/create.js';
import deleteSet from '../../server/api/practice_sets/delete.js';
import getSet from '../../server/api/practice_sets/get.js';
import listSets from '../../server/api/practice_sets/list.js';
import updateSet from '../../server/api/practice_sets/update.js';

const handlers = {
  create: createSet,
  delete: deleteSet,
  get: getSet,
  list: listSets,
  update: updateSet
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_sets action' });
  }

  return fn(req, res);
}
