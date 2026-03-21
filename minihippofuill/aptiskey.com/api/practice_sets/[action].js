import create from '../../server/api/practice_sets/create.js';
import remove from '../../server/api/practice_sets/delete.js';
import get from '../../server/api/practice_sets/get.js';
import list from '../../server/api/practice_sets/list.js';
import update from '../../server/api/practice_sets/update.js';

const handlers = {
  create,
  delete: remove,
  get,
  list,
  update
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_sets action' });
  }

  return fn(req, res);
}
