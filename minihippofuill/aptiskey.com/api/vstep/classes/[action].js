import assign from '../../../server/api/vstep/classes/assign.js';
import create from '../../../server/api/vstep/classes/create.js';
import list from '../../../server/api/vstep/classes/list.js';
import my from '../../../server/api/vstep/classes/my.js';

const handlers = {
  assign,
  create,
  list,
  my
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];
  if (!fn) return res.status(404).json({ error: 'Unknown vstep classes action' });
  return fn(req, res);
}
