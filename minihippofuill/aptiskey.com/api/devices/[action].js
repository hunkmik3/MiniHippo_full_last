import list from '../../server/api/devices/list.js';
import remove from '../../server/api/devices/remove.js';
import reset from '../../server/api/devices/reset.js';

const handlers = {
  list,
  remove,
  reset
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown devices action' });
  }

  return fn(req, res);
}
