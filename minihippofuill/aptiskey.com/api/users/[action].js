import create from '../../server/api/users/create.js';
import remove from '../../server/api/users/delete.js';
import list from '../../server/api/users/list.js';
import update from '../../server/api/users/update.js';

const handlers = {
  create,
  delete: remove,
  list,
  update
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown users action' });
  }

  return fn(req, res);
}
