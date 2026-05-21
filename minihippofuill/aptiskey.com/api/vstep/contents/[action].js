import create from '../../../server/api/vstep/contents/create.js';
import remove from '../../../server/api/vstep/contents/delete.js';
import get from '../../../server/api/vstep/contents/get.js';
import list from '../../../server/api/vstep/contents/list.js';
import update from '../../../server/api/vstep/contents/update.js';

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
  if (!fn) return res.status(404).json({ error: 'Unknown vstep contents action' });
  return fn(req, res);
}
