import remove from '../../../server/api/vstep/results/delete.js';
import list from '../../../server/api/vstep/results/list.js';
import submit from '../../../server/api/vstep/results/submit.js';
import update from '../../../server/api/vstep/results/update.js';

const handlers = {
  delete: remove,
  list,
  submit,
  update
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];
  if (!fn) return res.status(404).json({ error: 'Unknown vstep results action' });
  return fn(req, res);
}
