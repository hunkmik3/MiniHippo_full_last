import create from '../../../server/api/vstep/resources/create.js';
import list from '../../../server/api/vstep/resources/list.js';

const handlers = {
  create,
  list
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];
  if (!fn) return res.status(404).json({ error: 'Unknown vstep resources action' });
  return fn(req, res);
}
