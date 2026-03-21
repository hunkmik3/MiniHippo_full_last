import remove from '../../server/api/lessons/delete.js';
import getScriptUrl from '../../server/api/lessons/get-script-url.js';
import getScript from '../../server/api/lessons/get-script.js';
import get from '../../server/api/lessons/get.js';
import list from '../../server/api/lessons/list.js';

const handlers = {
  delete: remove,
  'get-script-url': getScriptUrl,
  'get-script': getScript,
  get,
  list
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown lessons action' });
  }

  return fn(req, res);
}
