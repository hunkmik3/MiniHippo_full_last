import remove from '../../server/api/practice_results/delete.js';
import list from '../../server/api/practice_results/list.js';
import myList from '../../server/api/practice_results/my-list.js';
import submit from '../../server/api/practice_results/submit.js';
import update from '../../server/api/practice_results/update.js';

const handlers = {
  delete: remove,
  list,
  'my-list': myList,
  submit,
  update
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_results action' });
  }

  return fn(req, res);
}
